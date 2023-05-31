export var Token;
(function (Token) {
    Token[Token["IDENT"] = 1] = "IDENT";
    Token[Token["ILLEGAL"] = 2] = "ILLEGAL";
    Token[Token["EOF"] = 3] = "EOF";
    Token[Token["EOL"] = 4] = "EOL";
    Token[Token["COMMENT"] = 5] = "COMMENT";
    Token[Token["INT"] = 6] = "INT";
    Token[Token["FLOAT"] = 7] = "FLOAT";
    //IMAG,   // 123.45i
    //CHAR,   // 'a'
    Token[Token["STRING"] = 8] = "STRING";
    Token[Token["ADD"] = 9] = "ADD";
    Token[Token["SUB"] = 10] = "SUB";
    Token[Token["MUL"] = 11] = "MUL";
    Token[Token["DIV"] = 12] = "DIV";
    Token[Token["MOD"] = 13] = "MOD";
    Token[Token["BIT_AND"] = 14] = "BIT_AND";
    Token[Token["BIT_OR"] = 15] = "BIT_OR";
    Token[Token["BIT_XOR"] = 16] = "BIT_XOR";
    Token[Token["BIT_SHL"] = 17] = "BIT_SHL";
    Token[Token["BIT_SHR"] = 18] = "BIT_SHR";
    Token[Token["BIT_AND_NOT"] = 19] = "BIT_AND_NOT";
    Token[Token["AT"] = 20] = "AT";
    Token[Token["DOLAR"] = 21] = "DOLAR";
    Token[Token["HASHTAG"] = 22] = "HASHTAG";
    Token[Token["QUESTION"] = 23] = "QUESTION";
    Token[Token["COALESCE"] = 24] = "COALESCE";
    Token[Token["LPAREN"] = 25] = "LPAREN";
    Token[Token["LBRACK"] = 26] = "LBRACK";
    Token[Token["LBRACE"] = 27] = "LBRACE";
    Token[Token["COMMA"] = 28] = "COMMA";
    Token[Token["DOT"] = 29] = "DOT";
    Token[Token["RPAREN"] = 30] = "RPAREN";
    Token[Token["RBRACK"] = 31] = "RBRACK";
    Token[Token["RBRACE"] = 32] = "RBRACE";
    Token[Token["SEMICOLON"] = 33] = "SEMICOLON";
    Token[Token["COLON"] = 34] = "COLON";
    Token[Token["ADD_ASSIGN"] = 35] = "ADD_ASSIGN";
    Token[Token["SUB_ASSIGN"] = 36] = "SUB_ASSIGN";
    Token[Token["MUL_ASSIGN"] = 37] = "MUL_ASSIGN";
    Token[Token["DIV_ASSIGN"] = 38] = "DIV_ASSIGN";
    Token[Token["MOD_ASSIGN"] = 39] = "MOD_ASSIGN";
    Token[Token["AND"] = 40] = "AND";
    Token[Token["OR"] = 41] = "OR";
    Token[Token["INCR"] = 42] = "INCR";
    Token[Token["DECR"] = 43] = "DECR";
    Token[Token["POW"] = 44] = "POW";
    Token[Token["EQL"] = 45] = "EQL";
    Token[Token["LSS"] = 46] = "LSS";
    Token[Token["GTR"] = 47] = "GTR";
    Token[Token["ASSIGN"] = 48] = "ASSIGN";
    Token[Token["NOT"] = 49] = "NOT";
    Token[Token["NEQ"] = 50] = "NEQ";
    Token[Token["LEQ"] = 51] = "LEQ";
    Token[Token["GEQ"] = 52] = "GEQ";
    Token[Token["LET"] = 53] = "LET";
    Token[Token["SYMBOL"] = 54] = "SYMBOL";
    Token[Token["IF"] = 55] = "IF";
    Token[Token["ELSE"] = 56] = "ELSE";
    Token[Token["CASE"] = 57] = "CASE";
    Token[Token["WHEN"] = 58] = "WHEN";
    Token[Token["WHILE"] = 59] = "WHILE";
    Token[Token["DO"] = 60] = "DO";
    Token[Token["DEFAULT"] = 61] = "DEFAULT";
    Token[Token["FOR"] = 62] = "FOR";
    Token[Token["EACH"] = 63] = "EACH";
    Token[Token["FALSE"] = 64] = "FALSE";
    Token[Token["TRUE"] = 65] = "TRUE";
    Token[Token["NULL"] = 66] = "NULL";
    Token[Token["RETURN"] = 67] = "RETURN";
    Token[Token["BREAK"] = 68] = "BREAK";
    Token[Token["CONTINUE"] = 69] = "CONTINUE";
    Token[Token["CLASS"] = 70] = "CLASS";
    Token[Token["FUNC"] = 71] = "FUNC";
    Token[Token["FN"] = 72] = "FN";
    Token[Token["PRINT"] = 73] = "PRINT";
    Token[Token["LEFT_DELIM"] = 74] = "LEFT_DELIM";
    Token[Token["RIGHT_DELIM"] = 75] = "RIGHT_DELIM";
})(Token || (Token = {}));
var keywords = {
    if: Token.IF,
    else: Token.ELSE,
    case: Token.CASE,
    when: Token.WHEN,
    while: Token.WHILE,
    do: Token.DO,
    default: Token.DEFAULT,
    for: Token.FOR,
    each: Token.EACH,
    false: Token.FALSE,
    true: Token.TRUE,
    null: Token.NULL,
    return: Token.RETURN,
    break: Token.BREAK,
    continue: Token.CONTINUE,
    let: Token.LET,
    class: Token.CLASS,
    func: Token.FUNC,
    fn: Token.FN,
    print: Token.PRINT,
};
var LowestPrec = 0, // non-operators
UnaryPrec = 6, HighestPrec = 7;
var Keyword = /** @class */ (function () {
    function Keyword() {
    }
    Keyword.prototype.isKeyword = function (key) {
        var _a;
        return (_a = keywords[key]) !== null && _a !== void 0 ? _a : Token.IDENT;
    };
    Keyword.prototype.precedence = function (op) {
        switch (op) {
            case Token.OR:
                return 1;
            case Token.AND:
                return 2;
            case Token.EQL:
            case Token.NEQ:
            case Token.LSS:
            case Token.LEQ:
            case Token.GTR:
            case Token.GEQ:
                return 3;
            case Token.ADD:
            case Token.SUB:
            case Token.OR:
                return 4;
            case Token.MUL:
            case Token.DIV:
            case Token.MOD:
            case Token.AND:
                return 5;
        }
        return LowestPrec;
    };
    return Keyword;
}());
export { Keyword };
//console.log(keywords["f"]);
//# sourceMappingURL=Token.js.map