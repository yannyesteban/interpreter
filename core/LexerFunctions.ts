export function isLetter(ch) {
    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z")) {
        return true;
    }
    return false;
}

function isKey() {}

export function isAlphaNumeric(ch) {
    if ((ch >= "a" && ch <= "z") || (ch >= "A" && ch <= "Z") || (ch >= "0" && ch <= "9") || ch == "_") {
        return true;
    }
    return false;
}

export function isDecimal(ch: string): boolean {
    return ch >= "0" && ch <= "9";
}

export function isHex(ch: string): boolean {
    return ("0" <= ch && ch <= "9") || ("a" <= ch.toLowerCase() && ch.toLowerCase() <= "f");
}
