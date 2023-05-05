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
    Token[Token["LPAREN"] = 18] = "LPAREN";
    Token[Token["LBRACK"] = 19] = "LBRACK";
    Token[Token["LBRACE"] = 20] = "LBRACE";
    Token[Token["COMMA"] = 21] = "COMMA";
    Token[Token["DOT"] = 22] = "DOT";
    Token[Token["RPAREN"] = 23] = "RPAREN";
    Token[Token["RBRACK"] = 24] = "RBRACK";
    Token[Token["RBRACE"] = 25] = "RBRACE";
    Token[Token["SEMICOLON"] = 26] = "SEMICOLON";
    Token[Token["COLON"] = 27] = "COLON";
    Token[Token["ADD_ASSIGN"] = 28] = "ADD_ASSIGN";
    Token[Token["SUB_ASSIGN"] = 29] = "SUB_ASSIGN";
    Token[Token["MUL_ASSIGN"] = 30] = "MUL_ASSIGN";
    Token[Token["DIV_ASSIGN"] = 31] = "DIV_ASSIGN";
    Token[Token["MOD_ASSIGN"] = 32] = "MOD_ASSIGN";
    Token[Token["AND"] = 33] = "AND";
    Token[Token["OR"] = 34] = "OR";
    Token[Token["INCR"] = 35] = "INCR";
    Token[Token["DECR"] = 36] = "DECR";
    Token[Token["POW"] = 37] = "POW";
    Token[Token["EQL"] = 38] = "EQL";
    Token[Token["LSS"] = 39] = "LSS";
    Token[Token["GTR"] = 40] = "GTR";
    Token[Token["ASSIGN"] = 41] = "ASSIGN";
    Token[Token["NOT"] = 42] = "NOT";
    Token[Token["NEQ"] = 43] = "NEQ";
    Token[Token["LEQ"] = 44] = "LEQ";
    Token[Token["GEQ"] = 45] = "GEQ";
    Token[Token["LET"] = 46] = "LET";
    Token[Token["SYMBOL"] = 47] = "SYMBOL";
    Token[Token["IF"] = 48] = "IF";
    Token[Token["ELSE"] = 49] = "ELSE";
    Token[Token["CASE"] = 50] = "CASE";
    Token[Token["WHEN"] = 51] = "WHEN";
    Token[Token["WHILE"] = 52] = "WHILE";
    Token[Token["DEFAULT"] = 53] = "DEFAULT";
    Token[Token["FOR"] = 54] = "FOR";
    Token[Token["EACH"] = 55] = "EACH";
    Token[Token["FALSE"] = 56] = "FALSE";
    Token[Token["TRUE"] = 57] = "TRUE";
    Token[Token["NULL"] = 58] = "NULL";
    Token[Token["RETURN"] = 59] = "RETURN";
    Token[Token["CLASS"] = 60] = "CLASS";
    Token[Token["FUNC"] = 61] = "FUNC";
})(Token || (Token = {}));
var keywords = {
    if: Token.IF,
    ELSE: Token.ELSE,
    case: Token.CASE,
    when: Token.WHEN,
    while: Token.WHILE,
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