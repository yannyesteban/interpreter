export var Token;
(function (Token) {
    Token[Token["IDENT"] = 1] = "IDENT";
    Token[Token["EOF"] = 2] = "EOF";
    Token[Token["COMMENT"] = 3] = "COMMENT";
    Token[Token["INT"] = 4] = "INT";
    Token[Token["FLOAT"] = 5] = "FLOAT";
    //IMAG,   // 123.45i
    //CHAR,   // 'a'
    Token[Token["STRING"] = 6] = "STRING";
    Token[Token["ADD"] = 7] = "ADD";
    Token[Token["SUB"] = 8] = "SUB";
    Token[Token["MUL"] = 9] = "MUL";
    Token[Token["DIV"] = 10] = "DIV";
    Token[Token["MOD"] = 11] = "MOD";
    Token[Token["BIT_AND"] = 12] = "BIT_AND";
    Token[Token["BIT_OR"] = 13] = "BIT_OR";
    Token[Token["BIT_XOR"] = 14] = "BIT_XOR";
    Token[Token["BIT_SHL"] = 15] = "BIT_SHL";
    Token[Token["BIT_SHR"] = 16] = "BIT_SHR";
    Token[Token["BIT_AND_NOT"] = 17] = "BIT_AND_NOT";
    Token[Token["QUESTION"] = 18] = "QUESTION";
    Token[Token["COALESCE"] = 19] = "COALESCE";
    Token[Token["LPAREN"] = 20] = "LPAREN";
    Token[Token["LBRACK"] = 21] = "LBRACK";
    Token[Token["LBRACE"] = 22] = "LBRACE";
    Token[Token["COMMA"] = 23] = "COMMA";
    Token[Token["DOT"] = 24] = "DOT";
    Token[Token["RPAREN"] = 25] = "RPAREN";
    Token[Token["RBRACK"] = 26] = "RBRACK";
    Token[Token["RBRACE"] = 27] = "RBRACE";
    Token[Token["SEMICOLON"] = 28] = "SEMICOLON";
    Token[Token["COLON"] = 29] = "COLON";
    Token[Token["ADD_ASSIGN"] = 30] = "ADD_ASSIGN";
    Token[Token["SUB_ASSIGN"] = 31] = "SUB_ASSIGN";
    Token[Token["MUL_ASSIGN"] = 32] = "MUL_ASSIGN";
    Token[Token["DIV_ASSIGN"] = 33] = "DIV_ASSIGN";
    Token[Token["MOD_ASSIGN"] = 34] = "MOD_ASSIGN";
    Token[Token["AND"] = 35] = "AND";
    Token[Token["OR"] = 36] = "OR";
    Token[Token["INCR"] = 37] = "INCR";
    Token[Token["DECR"] = 38] = "DECR";
    Token[Token["POW"] = 39] = "POW";
    Token[Token["EQL"] = 40] = "EQL";
    Token[Token["LSS"] = 41] = "LSS";
    Token[Token["GTR"] = 42] = "GTR";
    Token[Token["ASSIGN"] = 43] = "ASSIGN";
    Token[Token["NOT"] = 44] = "NOT";
    Token[Token["NEQ"] = 45] = "NEQ";
    Token[Token["LEQ"] = 46] = "LEQ";
    Token[Token["GEQ"] = 47] = "GEQ";
    Token[Token["LET"] = 48] = "LET";
    Token[Token["SYMBOL"] = 49] = "SYMBOL";
    Token[Token["IF"] = 50] = "IF";
    Token[Token["ELSE"] = 51] = "ELSE";
    Token[Token["CASE"] = 52] = "CASE";
    Token[Token["WHEN"] = 53] = "WHEN";
    Token[Token["WHILE"] = 54] = "WHILE";
    Token[Token["DO"] = 55] = "DO";
    Token[Token["DEFAULT"] = 56] = "DEFAULT";
    Token[Token["FOR"] = 57] = "FOR";
    Token[Token["EACH"] = 58] = "EACH";
    Token[Token["FALSE"] = 59] = "FALSE";
    Token[Token["TRUE"] = 60] = "TRUE";
    Token[Token["NULL"] = 61] = "NULL";
    Token[Token["RETURN"] = 62] = "RETURN";
    Token[Token["CLASS"] = 63] = "CLASS";
    Token[Token["FUNC"] = 64] = "FUNC";
    Token[Token["FN"] = 65] = "FN";
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