import { Keyword, Token } from "./Token.js";
import { isAlphaNumeric, isDecimal, isHex, isLetter } from "./LexerFunctions.js";
var keyword = new Keyword();
var unicode = { MaxRune: 65536 };
var Lexer = /** @class */ (function () {
    function Lexer(input) {
        this.input = "";
        this.pos = null;
        this.rd = null;
        this.eof = false;
        this.ch = "";
        this.input = input;
        this.pos = 0;
        this.rd = 0;
        this.ch = " ";
        this.eof = false;
        this.next();
        console.log(input);
    }
    Lexer.prototype.error = function (offs, msg) {
    };
    Lexer.prototype.evalOp = function (ch, tokenDefault, tokenAssign, tokenX2, tokenX3) {
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
    };
    Lexer.prototype.doubleOp = function (ch, tokenDefault, tokenX2) {
        if (tokenX2 && this.ch == ch) {
            this.next();
            return tokenX2;
        }
        return tokenDefault;
    };
    Lexer.prototype.skipWhitespace = function () {
        while (this.ch == ' ' || this.ch == '\t' || this.ch == '\n' || this.ch == '\r') {
            this.next();
        }
    };
    Lexer.prototype.digitVal = function (ch) {
        if ("0" <= ch && ch <= "9") {
            return (ch.charCodeAt(0) - "0".charCodeAt(0));
        }
        if ("a" <= ch.toLowerCase() && ch.toLowerCase() <= "f") {
            return (ch.charCodeAt(0) - "a".charCodeAt(0) + 10);
        }
        return 16;
    };
    Lexer.prototype.scanEscape = function (quote) {
        var _a, _b, _c, _d;
        var offs = this.pos;
        var n;
        var base, max;
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
                _a = [3, 8, 255], n = _a[0], base = _a[1], max = _a[2];
                break;
            case 'x':
                this.next();
                _b = [2, 16, 255], n = _b[0], base = _b[1], max = _b[2];
                break;
            case 'u':
                this.next();
                _c = [4, 16, unicode.MaxRune], n = _c[0], base = _c[1], max = _c[2];
                break;
            case 'U':
                this.next();
                _d = [8, 16, unicode.MaxRune], n = _d[0], base = _d[1], max = _d[2];
                break;
            default:
                var msg = "unknown escape sequence";
                if (this.ch < "\0") {
                    msg = "escape sequence not terminated";
                }
                this.error(offs, msg);
                return false;
        }
        var x;
        while (n > 0) {
            var d = this.digitVal(this.ch);
            if (d >= base) {
                var msg = "illegal character %#U in escape sequence" + this.ch;
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
        if (x > max || 0xD800 <= x && x < 0xE000) {
            this.error(offs, "escape sequence is invalid Unicode code point");
            return false;
        }
        return true;
    };
    Lexer.prototype.scanString = function (quote) {
        // '"' opening already consumed
        var offs = this.pos - 1;
        while (true) {
            var ch = this.ch;
            if (ch == "\n" || ch < "\0") {
                this.error(offs, "string literal not terminated");
                break;
            }
            this.next();
            if (ch == quote) {
                break;
            }
            if (ch == '\\') {
                this.scanEscape(quote);
            }
        }
        return this.input.substring(offs, this.pos);
    };
    Lexer.prototype.scanIdentifier = function () {
        var init = this.pos;
        var end = init;
        var lit = "";
        while (!this.eof) {
            var ch = this.ch;
            if (isAlphaNumeric(ch)) {
                end++;
                lit += this.ch;
                this.next();
                continue;
            }
            break;
        }
        return lit;
    };
    Lexer.prototype.scanNumber = function () {
        var _a, _b, _c, _d;
        var offs = this.pos;
        var tok = Token.INT;
        var base = 10; // number base
        var prefix = "0"; // one of 0 (decimal), '0' (0-octal), 'x', 'o', or 'b'
        //digsep = 0       // bit 0: digit present, bit 1: '_' present
        //invalid = -1     // index of invalid digit in literal, or < 0
        var lit = "c";
        // integer part
        if (this.ch != '.') {
            tok = Token.INT;
            if (this.ch == '0') {
                this.next();
                switch (this.ch.toLowerCase()) {
                    case 'x':
                        this.next();
                        _a = [16, 'x'], base = _a[0], prefix = _a[1];
                        break;
                    case 'o':
                        this.next();
                        (_b = [8, 'o'], base = _b[0], prefix = _b[1]);
                        break;
                    case 'b':
                        this.next();
                        _c = [2, 'b'], base = _c[0], prefix = _c[1];
                        break;
                    default:
                        _d = [8, '0'], base = _d[0], prefix = _d[1];
                    //digsep = 1 // leading 0
                }
            }
            //digsep |= 
            this.digits(base);
        }
        // fractional part
        if (this.ch == '.') {
            tok = Token.FLOAT;
            if (prefix == 'o' || prefix == 'b') {
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
        var e = this.ch.toLowerCase();
        if (e == 'e' || e == 'p') {
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
            if (this.ch == '+' || this.ch == '-') {
                this.next();
            }
            var ds = this.digits(10);
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
        console.log("<>", offs, this.pos, " = ", lit);
        //return lit
        return { lit: lit, tok: tok };
    };
    Lexer.prototype.digits = function (base) {
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
    };
    Lexer.prototype.scan = function () {
        var _a;
        var ch = null;
        var lit = "*** ERROR ***";
        var tok = null;
        var offs = 0;
        while (!this.eof) {
            this.skipWhitespace();
            ch = this.ch;
            offs = this.pos;
            console.log(this.ch);
            if (isLetter(ch) || ch == "_") {
                lit = this.scanIdentifier();
                console.log(".....", lit);
                if (lit.length > 1) {
                    tok = keyword.isKeyword(lit);
                }
                else {
                    tok = Token.IDENT;
                }
                break;
            }
            else if (isDecimal(ch) || ch == '.' && isDecimal(this.peek())) {
                (_a = this.scanNumber(), lit = _a.lit, tok = _a.tok);
                //console.log("this.scanNumber()", this.scanNumber())
                //{lit, tok} = this.scanNumber()
                console.log(lit, tok);
                break;
            }
            else {
                this.next();
                switch (ch) {
                    case "\"":
                    case "'":
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
                        tok = Token.RPAREN;
                        lit = ")";
                        break;
                    case "[":
                        tok = Token.LBRACK;
                        lit = "[";
                        break;
                    case "]":
                        tok = Token.RBRACK;
                        lit = "]";
                        break;
                    case "{":
                        tok = Token.LBRACE;
                        lit = "{";
                        break;
                    case "}":
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
                    case "+":
                        tok = this.evalOp(ch, Token.ADD, Token.ADD_ASSIGN, Token.INCR, null);
                        lit = this.input.substring(offs, this.pos);
                        break;
                    case "-":
                        tok = this.evalOp(ch, Token.SUB, Token.SUB_ASSIGN, Token.DECR, null);
                        lit = this.input.substring(offs, this.pos);
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
                }
            }
            break;
        }
        console.log(lit, tok);
        return {
            pos: this.pos,
            value: lit,
            priority: keyword.precedence(tok),
            tok: tok
        };
    };
    Lexer.prototype.next = function () {
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
    };
    Lexer.prototype.peek = function () {
        if (this.pos < this.input.length) {
            return this.input[this.pos];
        }
        return null;
    };
    Lexer.prototype.getTokens = function () {
        var tokens = [];
        while (!this.eof) {
            tokens.push(this.scan());
        }
        return tokens;
    };
    return Lexer;
}());
export { Lexer };
/*
console.log(Token);

let source = `while if for while  987.368  5e+3 -24 0xaf01 0b2 if yanny, esteban, hello; wait; test 4==5 6=3 2+2 k+=8`;

source = '6+6*2 || 2';
let lexer = new Lexer(source);

console.log(source, "\n", lexer.getTokens());

`
if(a>1){"445"}else{"aaa"};a=45;case(a){when(1){ 456}when(2){100}default{3001}}

`
*/ 
//# sourceMappingURL=Lexer.js.map