export class DateUtil {
    static parse(source, pattern) {
        const datePattern = pattern.replace(/%d|%m|%y|%h|%i|%s|%p/ig, (token) => {
            switch (token) {
                case "%d":
                    return "(?<day>\\d{1,2})";
                case "%m":
                    return "(?<month>\\d{1,2})";
                case "%y":
                    return "(?<year>\\d{4})";
                case "%h":
                    return "(?<hour>\\d{1,2})";
                case "%i":
                    return "(?<minute>\\d{1,2})";
                case "%s":
                    return "(?<second>\\d{1,2})";
                case "%p":
                    return "(?<ampm>am|pm)";
            }
            return token;
        });
        const re = new RegExp(datePattern, "ig");
        return re.exec(source).groups;
    }
    static date(source, pattern) {
        const info = this.parse(source, pattern);
        if ((info === null || info === void 0 ? void 0 : info.ampm) && (info === null || info === void 0 ? void 0 : info.ampm) == "pm") {
            info.hour = +info.hour + 12;
        }
        return new Date(+info.year, +info.month - 1, +info.day, +info.hour || 0, +info.minute || 0, +info.second);
    }
    static valid(source, pattern) {
        return true;
    }
}
//# sourceMappingURL=DateUtil.js.map