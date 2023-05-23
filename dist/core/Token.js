export var Token;
(function (Token) {
    Token[Token["IDENT"] = 1] = "IDENT";
    Token[Token["EOF"] = 2] = "EOF";
    Token[Token["EOL"] = 3] = "EOL";
    Token[Token["COMMENT"] = 4] = "COMMENT";
    Token[Token["INT"] = 5] = "INT";
    Token[Token["FLOAT"] = 6] = "FLOAT";
    //IMAG,   // 123.45i
    //CHAR,   // 'a'
    Token[Token["STRING"] = 7] = "STRING";
    Token[Token["ADD"] = 8] = "ADD";
    Token[Token["SUB"] = 9] = "SUB";
    Token[Token["MUL"] = 10] = "MUL";
    Token[Token["DIV"] = 11] = "DIV";
    Token[Token["MOD"] = 12] = "MOD";
    Token[Token["BIT_AND"] = 13] = "BIT_AND";
    Token[Token["BIT_OR"] = 14] = "BIT_OR";
    Token[Token["BIT_XOR"] = 15] = "BIT_XOR";
    Token[Token["BIT_SHL"] = 16] = "BIT_SHL";
    Token[Token["BIT_SHR"] = 17] = "BIT_SHR";
    Token[Token["BIT_AND_NOT"] = 18] = "BIT_AND_NOT";
    Token[Token["QUESTION"] = 19] = "QUESTION";
    Token[Token["COALESCE"] = 20] = "COALESCE";
    Token[Token["LPAREN"] = 21] = "LPAREN";
    Token[Token["LBRACK"] = 22] = "LBRACK";
    Token[Token["LBRACE"] = 23] = "LBRACE";
    Token[Token["COMMA"] = 24] = "COMMA";
    Token[Token["DOT"] = 25] = "DOT";
    Token[Token["RPAREN"] = 26] = "RPAREN";
    Token[Token["RBRACK"] = 27] = "RBRACK";
    Token[Token["RBRACE"] = 28] = "RBRACE";
    Token[Token["SEMICOLON"] = 29] = "SEMICOLON";
    Token[Token["COLON"] = 30] = "COLON";
    Token[Token["ADD_ASSIGN"] = 31] = "ADD_ASSIGN";
    Token[Token["SUB_ASSIGN"] = 32] = "SUB_ASSIGN";
    Token[Token["MUL_ASSIGN"] = 33] = "MUL_ASSIGN";
    Token[Token["DIV_ASSIGN"] = 34] = "DIV_ASSIGN";
    Token[Token["MOD_ASSIGN"] = 35] = "MOD_ASSIGN";
    Token[Token["AND"] = 36] = "AND";
    Token[Token["OR"] = 37] = "OR";
    Token[Token["INCR"] = 38] = "INCR";
    Token[Token["DECR"] = 39] = "DECR";
    Token[Token["POW"] = 40] = "POW";
    Token[Token["EQL"] = 41] = "EQL";
    Token[Token["LSS"] = 42] = "LSS";
    Token[Token["GTR"] = 43] = "GTR";
    Token[Token["ASSIGN"] = 44] = "ASSIGN";
    Token[Token["NOT"] = 45] = "NOT";
    Token[Token["NEQ"] = 46] = "NEQ";
    Token[Token["LEQ"] = 47] = "LEQ";
    Token[Token["GEQ"] = 48] = "GEQ";
    Token[Token["LET"] = 49] = "LET";
    Token[Token["SYMBOL"] = 50] = "SYMBOL";
    Token[Token["IF"] = 51] = "IF";
    Token[Token["ELSE"] = 52] = "ELSE";
    Token[Token["CASE"] = 53] = "CASE";
    Token[Token["WHEN"] = 54] = "WHEN";
    Token[Token["WHILE"] = 55] = "WHILE";
    Token[Token["DO"] = 56] = "DO";
    Token[Token["DEFAULT"] = 57] = "DEFAULT";
    Token[Token["FOR"] = 58] = "FOR";
    Token[Token["EACH"] = 59] = "EACH";
    Token[Token["FALSE"] = 60] = "FALSE";
    Token[Token["TRUE"] = 61] = "TRUE";
    Token[Token["NULL"] = 62] = "NULL";
    Token[Token["RETURN"] = 63] = "RETURN";
    Token[Token["CLASS"] = 64] = "CLASS";
    Token[Token["FUNC"] = 65] = "FUNC";
    Token[Token["FN"] = 66] = "FN";
    Token[Token["PRINT"] = 67] = "PRINT";
})(Token || (Token = {}));
var keywords = {
    if: Token.IF,
    ELSE: Token.ELSE,
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