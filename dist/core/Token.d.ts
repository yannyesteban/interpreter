export declare enum Token {
    IDENT = 1,
    ILLEGAL = 2,
    EOF = 3,
    EOL = 4,
    COMMENT = 5,
    INT = 6,
    FLOAT = 7,
    STRING = 8,
    ADD = 9,
    SUB = 10,
    MUL = 11,
    DIV = 12,
    MOD = 13,
    BIT_AND = 14,
    BIT_OR = 15,
    BIT_XOR = 16,
    BIT_SHL = 17,
    BIT_SHR = 18,
    BIT_AND_NOT = 19,
    AT = 20,
    DOLAR = 21,
    HASHTAG = 22,
    QUESTION = 23,
    COALESCE = 24,
    LPAREN = 25,
    LBRACK = 26,
    LBRACE = 27,
    COMMA = 28,
    DOT = 29,
    RPAREN = 30,
    RBRACK = 31,
    RBRACE = 32,
    SEMICOLON = 33,
    COLON = 34,
    ADD_ASSIGN = 35,
    SUB_ASSIGN = 36,
    MUL_ASSIGN = 37,
    DIV_ASSIGN = 38,
    MOD_ASSIGN = 39,
    AND = 40,
    OR = 41,
    INCR = 42,
    DECR = 43,
    POW = 44,
    EQL = 45,
    LSS = 46,
    GTR = 47,
    ASSIGN = 48,
    NOT = 49,
    NEQ = 50,
    LEQ = 51,
    GEQ = 52,
    LET = 53,
    SYMBOL = 54,
    IF = 55,
    ELSE = 56,
    CASE = 57,
    WHEN = 58,
    WHILE = 59,
    DO = 60,
    DEFAULT = 61,
    FOR = 62,
    EACH = 63,
    FALSE = 64,
    TRUE = 65,
    NULL = 66,
    RETURN = 67,
    BREAK = 68,
    CONTINUE = 69,
    CLASS = 70,
    FUNC = 71,
    FN = 72,
    PRINT = 73,
    LEFT_DELIM = 74,
    RIGHT_DELIM = 75
}
export declare class Keyword {
    constructor();
    isKeyword(key: string): any;
    precedence(op: number): number;
}