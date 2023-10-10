import { Keyword, Token } from "./Token.js";
import { isAlphaNumeric, isDecimal, isHex, isLetter } from "./LexerFunctions.js";
var keyword = new Keyword();
var unicode = { MaxRune: 65536 };
export class Section {
    constructor(tokens, pos, length, outside) {
        this.tokens = [];
        this.pos = 0;
        this.length = 0;
        this.outside = false;
        this.tokens = tokens;
        this.pos = pos;
        this.length = length;
        this.outside = outside;
    }
}
export class Lexer {
    constructor(input, useString) {
        this.input = "";
        this.pos = null;
        this.rd = null;
        this.eof = false;
        this.ch = "";
        this.markEOL = false;
        this.input = input;
        this.pos = 0;
        this.rd = 0;
        this.ch = " ";
        this.eof = false;
        this.next();
        //console.log(input);
    }
    error(offs, msg) {
        throw new Error(msg);
    }
    evalOp(ch, tokenDefault, tokenAssign, tokenX2, tokenX3) {
        if (this.ch == "=") {
            this.next();
            return tokenAssign;
        }
        if (tokenX2 && this.ch == ch) {
            this.next();
            if (tokenX3 && this.ch == ch) {
                this.next();
                return tokenX3;
            }
            return tokenX2;
        }
        return tokenDefault;
    }
    doubleOp(ch, tokenDefault, tokenX2) {
        if (tokenX2 && this.ch == ch) {
            this.next();
            return tokenX2;
        }
        return tokenDefault;
    }
    skipWhitespace() {
        while (this.ch == " " || this.ch == "\t" || (this.ch == "\n" && !this.markEOL) || this.ch == "\r") {
            this.next();
        }
    }
    digitVal(ch) {
        if ("0" <= ch && ch <= "9") {
            return ch.charCodeAt(0) - "0".charCodeAt(0);
        }
        if ("a" <= ch.toLowerCase() && ch.toLowerCase() <= "f") {
            return ch.charCodeAt(0) - "a".charCodeAt(0) + 10;
        }
        return 16;
    }
    scanEscape(quote) {
        const offs = this.pos;
        let n;
        let base, max;
        switch (this.ch) {
            case "a":
            case "b":
            case "f":
            case "n":
            case "r":
            case "t":
            case "v":
            case "\\":
            case quote:
                this.next();
                return true;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
                [n, base, max] = [3, 8, 255];
                break;
            case "x":
                this.next();
                [n, base, max] = [2, 16, 255];
                break;
            case "u":
                this.next();
                [n, base, max] = [4, 16, unicode.MaxRune];
                break;
            case "U":
                this.next();
                [n, base, max] = [8, 16, unicode.MaxRune];
                break;
            default:
                let msg = "unknown escape sequence";
                if (this.ch < "\0") {
                    msg = "escape sequence not terminated";
                }
                this.error(offs, msg);
                return false;
        }
        let x;
        while (n > 0) {
            let d = this.digitVal(this.ch);
            if (d >= base) {
                let msg = "illegal character %#U in escape sequence" + this.ch;
                if (this.ch < "\n") {
                    msg = "escape sequence not terminated";
                }
                this.error(this.pos, msg);
                return false;
            }
            x = x * base + d;
            this.next();
            n--;
        }
        if (x > max || (0xd800 <= x && x < 0xe000)) {
            this.error(offs, "escape sequence is invalid Unicode code point");
            return false;
        }
        return true;
    }
    scanString(quote) {
        // '"' opening already consumed
        const offs = this.pos - 1;
        while (true) {
            let ch = this.ch;
            if ( /*ch == "\n" ||*/ch < "\0") {
                this.error(offs, "string literal not terminated");
                break;
            }
            this.next();
            if (ch == quote) {
                break;
            }
            if (ch == "\\") {
                this.scanEscape(quote);
            }
        }
        return this.input.substring(offs + 1, this.pos - 1);
        //return this.input.substring(offs, this.pos);
    }
    scanIdentifier() {
        let init = this.pos;
        let end = init;
        let lit = "";
        while (!this.eof) {
            let ch = this.ch;
            if (isAlphaNumeric(ch)) {
                end++;
                lit += this.ch;
                this.next();
                continue;
            }
            break;
        }
        return lit;
    }
    scanNumber() {
        let offs = this.pos;
        let tok = Token.INT;
        let base = 10; // number base
        let prefix = "0"; // one of 0 (decimal), '0' (0-octal), 'x', 'o', or 'b'
        //digsep = 0       // bit 0: digit present, bit 1: '_' present
        //invalid = -1     // index of invalid digit in literal, or < 0
        let lit = "c";
        // integer part
        if (this.ch != ".") {
            tok = Token.INT;
            if (this.ch == "0") {
                this.next();
                switch (this.ch.toLowerCase()) {
                    case "x":
                        this.next();
                        [base, prefix] = [16, "x"];
                        break;
                    case "o":
                        this.next();
                        [base, prefix] = [8, "o"];
                        break;
                    case "b":
                        this.next();
                        [base, prefix] = [2, "b"];
                        break;
                    default:
                        [base, prefix] = [8, "0"];
                    //digsep = 1 // leading 0
                }
            }
            //digsep |=
            this.digits(base);
        }
        // fractional part
        if (this.ch == ".") {
            tok = Token.FLOAT;
            if (prefix == "o" || prefix == "b") {
                //s.error(s.offset, "invalid radix point in "+litname(prefix))
            }
            this.next();
            this.digits(base);
        }
        /*
        if digsep&1 == 0 {
            s.error(s.offset, litname(prefix)+" has no digits")
        }
        */
        // exponent
        const e = this.ch.toLowerCase();
        if (e == "e" || e == "p") {
            /*
            switch {
            case e == 'e' && prefix != 0 && prefix != '0':
                s.errorf(s.offset, "%q exponent requires decimal mantissa", s.ch)
            case e == 'p' && prefix != 'x':
                s.errorf(s.offset, "%q exponent requires hexadecimal mantissa", s.ch)
            }
            */
            this.next();
            tok = Token.FLOAT;
            if (this.ch == "+" || this.ch == "-") {
                this.next();
            }
            let ds = this.digits(10);
            /*digsep |= ds
            if ds&1 == 0 {
                s.error(s.offset, "exponent has no digits")
            }
            */
        }
        /*
        else if prefix == 'x' && tok == token.FLOAT {
            s.error(s.offset, "hexadecimal mantissa requires a 'p' exponent")
        }
    
        // suffix 'i'
        if s.ch == 'i' {
            tok = token.IMAG
            s.next()
        }
    
        lit = string(s.src[offs:s.offset])
        if tok == token.INT && invalid >= 0 {
            s.errorf(invalid, "invalid digit %q in %s", lit[invalid-offs], litname(prefix))
        }
        if digsep&2 != 0 {
            if i = invalidSep(lit); i >= 0 {
                s.error(offs+i, "'_' must separate successive digits")
            }
        }
        */
        lit = this.input.substring(offs, this.pos);
        //console.log("<>", offs, this.pos, " = ", lit)
        //return lit
        return { lit, tok };
    }
    digits(base) {
        if (base <= 10) {
            //max := rune('0' + base)
            while (isDecimal(this.ch)) {
                this.next();
            }
        }
        else {
            while (isHex(this.ch)) {
                this.next();
            }
        }
        return;
    }
    scan() {
        let ch = null;
        let lit = "*** ERROR ***";
        let tok = null;
        let offs = 0;
        let markEOL = false;
        while (!this.eof) {
            this.skipWhitespace();
            ch = this.ch;
            offs = this.pos;
            //console.log(this.ch)
            markEOL = false;
            if (isLetter(ch) || ch == "_") {
                lit = this.scanIdentifier();
                //console.log(".....", lit)
                if (lit.length > 1) {
                    tok = keyword.isKeyword(lit);
                    switch (tok) {
                        case Token.IDENT:
                        case Token.BREAK:
                        case Token.CONTINUE:
                        case Token.RETURN:
                            markEOL = true;
                    }
                }
                else {
                    markEOL = true;
                    tok = Token.IDENT;
                }
                break;
            }
            else if (isDecimal(ch) || (ch == "." && isDecimal(this.peek()))) {
                markEOL = true;
                ({ lit, tok } = this.scanNumber());
                //console.log("this.scanNumber()", this.scanNumber())
                //{lit, tok} = this.scanNumber()
                //console.log(lit, tok)
                break;
            }
            else {
                this.next();
                switch (ch) {
                    case "\0":
                        if (this.markEOL) {
                            this.markEOL = false;
                            tok = Token.SEMICOLON;
                            lit = "EOF";
                        }
                        else {
                            tok = Token.EOF;
                        }
                        break;
                    case "\n":
                        markEOL = false;
                        tok = Token.SEMICOLON;
                        lit = "\n";
                        break;
                    case '"':
                    case "'":
                        /*if(this.useString){
                            tok = Token.STRING;
                            lit = this.scanString(ch);
                        }else{
                            tok = Token.SYMBOL;
                            lit = ch;
                        }*/
                        markEOL = true;
                        tok = Token.STRING;
                        lit = this.scanString(ch);
                        break;
                    case ":":
                        tok = this.evalOp(ch, Token.COLON, Token.LET, null, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case ".":
                        tok = Token.DOT;
                        lit = ".";
                        break;
                    case "(":
                        tok = Token.LPAREN;
                        lit = "(";
                        break;
                    case ")":
                        markEOL = true;
                        tok = Token.RPAREN;
                        lit = ")";
                        break;
                    case "[":
                        tok = Token.LBRACK;
                        lit = "[";
                        break;
                    case "]":
                        markEOL = true;
                        tok = Token.RBRACK;
                        lit = "]";
                        break;
                    case "{":
                        tok = Token.LBRACE;
                        lit = "{";
                        break;
                    case "}":
                        //markEOL = true;
                        tok = Token.RBRACE;
                        lit = "}";
                        break;
                    case ",":
                        tok = Token.COMMA;
                        lit = ",";
                        break;
                    case ";":
                        tok = Token.SEMICOLON;
                        lit = ";";
                        break;
                    case "?":
                        tok = Token.QUESTION;
                        lit = "?";
                        if (this.ch == "?") {
                            this.next();
                            tok = Token.COALESCE;
                            lit = "??";
                        }
                        break;
                    case "+":
                        tok = this.evalOp(ch, Token.ADD, Token.ADD_ASSIGN, Token.INCR, null);
                        lit = this.input.substring(offs, this.pos);
                        if (tok === Token.INCR) {
                            markEOL = true;
                        }
                        break;
                    case "-":
                        tok = this.evalOp(ch, Token.SUB, Token.SUB_ASSIGN, Token.DECR, null);
                        lit = this.input.substring(offs, this.pos);
                        if (tok === Token.DECR) {
                            markEOL = true;
                        }
                        break;
                    case "*":
                        tok = this.evalOp(ch, Token.MUL, Token.MUL_ASSIGN, Token.POW, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "/":
                        tok = this.evalOp(ch, Token.DIV, Token.DIV_ASSIGN, null, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "%":
                        tok = this.evalOp(ch, Token.MOD, Token.MOD_ASSIGN, null, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "=":
                        tok = this.evalOp(ch, Token.ASSIGN, Token.EQL, null, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "!":
                        tok = this.evalOp(ch, Token.NOT, Token.NEQ, null, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "&":
                        tok = this.doubleOp(ch, Token.BIT_AND, Token.AND);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "|":
                        tok = this.doubleOp(ch, Token.BIT_OR, Token.OR);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "<":
                        tok = this.evalOp(ch, Token.LSS, Token.LEQ, null, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case ">":
                        tok = this.evalOp(ch, Token.GTR, Token.GEQ, null, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "@":
                        tok = Token.AT;
                        lit = "@";
                        break;
                    case "$":
                        tok = Token.DOLAR;
                        lit = "$";
                        break;
                    case "#":
                        tok = Token.HASHTAG;
                        lit = "#";
                        break;
                    default:
                        markEOL = this.markEOL;
                        tok = Token.ILLEGAL;
                        lit = ch;
                }
            }
            break;
        }
        //console.log(lit, tok)
        if (true) {
            this.markEOL = markEOL;
        }
        return {
            pos: this.pos,
            value: lit,
            priority: keyword.precedence(tok),
            tok,
        };
    }
    next() {
        if (this.rd < this.input.length) {
            this.pos = this.rd;
            this.ch = this.input[this.pos];
            this.rd++;
        }
        else {
            this.pos = this.input.length;
            this.eof = true;
            this.ch = "\0";
        }
    }
    setPosition(pos) {
        if (pos < this.input.length) {
            this.pos = pos;
            this.ch = this.input[this.pos];
            this.rd = this.pos + 1;
        }
        else {
            this.pos = this.input.length;
            this.eof = true;
            this.ch = "\0";
        }
    }
    peek() {
        if (this.pos < this.input.length) {
            return this.input[this.pos];
        }
        return null;
    }
    getTokens() {
        let tokens = [];
        while (!this.eof) {
            tokens.push(this.scan());
        }
        tokens.push({
            pos: null,
            value: "EOF",
            priority: null,
            tok: Token.EOF,
        });
        return tokens;
    }
    getSections(leftDelim, rightDelim) {
        const sections = [];
        while (!this.eof) {
            let tokens = [];
            let pos = 0;
            let endPos = 0;
            let index = this.input.indexOf(leftDelim, this.pos);
            if (index >= 0) {
                pos = index;
                this.setPosition(index + leftDelim.length);
                while (!this.eof) {
                    this.skipWhitespace();
                    if (this.peek() == rightDelim[0]) {
                        index = this.input.indexOf(rightDelim, this.pos);
                        if (index > 0) {
                            endPos = index + rightDelim.length;
                            this.setPosition(index + rightDelim.length);
                            break;
                        }
                    }
                    tokens.push(this.scan());
                }
                tokens.push({
                    pos: null,
                    value: "EOF",
                    priority: null,
                    tok: Token.EOF,
                });
                sections.push(new Section(tokens, pos, endPos - pos, this.input[pos - 1] === '"' && this.input[endPos] === '"'));
            }
            this.next();
        }
        return sections;
    }
}
//# sourceMappingURL=Lexer.js.map