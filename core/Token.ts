export enum Token {
	IDENT = 1, // main
	ILLEGAL,
	EOF,
	EOL, // \n
	COMMENT,
	INT, // 12345
	FLOAT, // 123.45
	//IMAG,   // 123.45i
	//CHAR,   // 'a'
	STRING, // "abc"



	ADD, // +
	SUB, // -
	MUL, // *
	DIV, // /
	MOD, // %

	BIT_AND,     // &
	BIT_OR,      // |
	BIT_XOR,     // ^
	BIT_SHL,     // <<
	BIT_SHR,     // >>
	BIT_AND_NOT, // &^

	AT, //@
	DOLAR, //$
	HASHTAG, //#

	QUESTION, // ? 
	COALESCE, // ?? 

	LPAREN, // (
	LBRACK, // [
	LBRACE, // {
	COMMA, // ,
	DOT, // .

	RPAREN, // )
	RBRACK, // ]
	RBRACE, // }
	SEMICOLON, // ;
	COLON, // :

	ADD_ASSIGN, // +=
	SUB_ASSIGN, // -=
	MUL_ASSIGN, // *=
	DIV_ASSIGN, // /=
	MOD_ASSIGN, // %=

	AND, // &&
	OR, // ||

	INCR, // ++
	DECR, // --
	POW, // **

	EQL, // ==
	LSS, // <
	GTR, // >
	ASSIGN, // =
	NOT, // (!)

	NEQ, // (!=)
	LEQ, // <=
	GEQ, // >=
	LET, // :=

	SYMBOL,


	IF, // "if"
	ELSE, // "else"
	CASE, // "case"
	WHEN, // "when"
	WHILE, // "while"
	DO, // "DO"
	DEFAULT, // "default"
	FOR, // "for"
	EACH, // "each"
	FALSE, // "false"
	TRUE, // "true"
	NULL, // "true"
	RETURN, // "return"
	BREAK, // "break"
	CONTINUE, // "continue"

	CLASS, // "class"
	FUNC, // "func"
	FN, // "fn"
	PRINT, // "print"

	LEFT_DELIM,
	RIGHT_DELIM,
	
}

const keywords = {
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
const
	LowestPrec = 0, // non-operators
	UnaryPrec = 6,
	HighestPrec = 7
	;

export class Keyword {
	constructor() { }

	isKeyword(key: string) {
		return keywords[key] ?? Token.IDENT;
	}

	precedence(op: number): number {
		switch (op) {
			case Token.OR:
				return 1
			case Token.AND:
				return 2
			case Token.EQL:
			case Token.NEQ:
			case Token.LSS:
			case Token.LEQ:
			case Token.GTR:
			case Token.GEQ:
				return 3
			case Token.ADD:
			case Token.SUB:
			case Token.OR:
				return 4
			case Token.MUL:
			case Token.DIV:
			case Token.MOD:
			case Token.AND:
				return 5
		}
		return LowestPrec
	}


}

//console.log(keywords["f"]);
