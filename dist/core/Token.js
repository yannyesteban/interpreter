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
    Token[Token["AT"] = 19] = "AT";
    Token[Token["DOLAR"] = 20] = "DOLAR";
    Token[Token["HASHTAG"] = 21] = "HASHTAG";
    Token[Token["QUESTION"] = 22] = "QUESTION";
    Token[Token["COALESCE"] = 23] = "COALESCE";
    Token[Token["LPAREN"] = 24] = "LPAREN";
    Token[Token["LBRACK"] = 25] = "LBRACK";
    Token[Token["LBRACE"] = 26] = "LBRACE";
    Token[Token["COMMA"] = 27] = "COMMA";
    Token[Token["DOT"] = 28] = "DOT";
    Token[Token["RPAREN"] = 29] = "RPAREN";
    Token[Token["RBRACK"] = 30] = "RBRACK";
    Token[Token["RBRACE"] = 31] = "RBRACE";
    Token[Token["SEMICOLON"] = 32] = "SEMICOLON";
    Token[Token["COLON"] = 33] = "COLON";
    Token[Token["ADD_ASSIGN"] = 34] = "ADD_ASSIGN";
    Token[Token["SUB_ASSIGN"] = 35] = "SUB_ASSIGN";
    Token[Token["MUL_ASSIGN"] = 36] = "MUL_ASSIGN";
    Token[Token["DIV_ASSIGN"] = 37] = "DIV_ASSIGN";
    Token[Token["MOD_ASSIGN"] = 38] = "MOD_ASSIGN";
    Token[Token["AND"] = 39] = "AND";
    Token[Token["OR"] = 40] = "OR";
    Token[Token["INCR"] = 41] = "INCR";
    Token[Token["DECR"] = 42] = "DECR";
    Token[Token["POW"] = 43] = "POW";
    Token[Token["EQL"] = 44] = "EQL";
    Token[Token["LSS"] = 45] = "LSS";
    Token[Token["GTR"] = 46] = "GTR";
    Token[Token["ASSIGN"] = 47] = "ASSIGN";
    Token[Token["NOT"] = 48] = "NOT";
    Token[Token["NEQ"] = 49] = "NEQ";
    Token[Token["LEQ"] = 50] = "LEQ";
    Token[Token["GEQ"] = 51] = "GEQ";
    Token[Token["LET"] = 52] = "LET";
    Token[Token["SYMBOL"] = 53] = "SYMBOL";
    Token[Token["IF"] = 54] = "IF";
    Token[Token["ELSE"] = 55] = "ELSE";
    Token[Token["CASE"] = 56] = "CASE";
    Token[Token["WHEN"] = 57] = "WHEN";
    Token[Token["WHILE"] = 58] = "WHILE";
    Token[Token["DO"] = 59] = "DO";
    Token[Token["DEFAULT"] = 60] = "DEFAULT";
    Token[Token["FOR"] = 61] = "FOR";
    Token[Token["EACH"] = 62] = "EACH";
    Token[Token["FALSE"] = 63] = "FALSE";
    Token[Token["TRUE"] = 64] = "TRUE";
    Token[Token["NULL"] = 65] = "NULL";
    Token[Token["RETURN"] = 66] = "RETURN";
    Token[Token["CLASS"] = 67] = "CLASS";
    Token[Token["FUNC"] = 68] = "FUNC";
    Token[Token["FN"] = 69] = "FN";
    Token[Token["PRINT"] = 70] = "PRINT";
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