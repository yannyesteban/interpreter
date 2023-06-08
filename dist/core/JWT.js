import { createHmac, timingSafeEqual } from "node:crypto";
var header = {
    alg: "HS256",
    typ: "JWT",
};
var payload = {
    "iss": "a_random_server_name",
    "exp": 1500,
    "name": "John Bobo",
    "email": "myemail@test.com",
    "isHuman": true
};
var JWT = /** @class */ (function () {
    function JWT(opt) {
        this.key = "super_secret_society";
        for (var key in opt) {
            this[key] = opt[key];
        }
    }
    JWT.prototype.verify = function (token) {
        var parts = token.split(".");
        var signature = Buffer.from(parts[2]);
        var expected = this.getSignature(parts[0] + "." + parts[1]);
        if (timingSafeEqual(signature, Buffer.from(expected))) {
            return JSON.parse(Buffer.from(parts[1], "base64url").toString());
        }
        return null;
    };
    JWT.prototype.generate = function () {
        var h = base64Encode(JSON.stringify(header));
        var p = base64Encode(JSON.stringify(payload));
        return this.getSignature(h + "." + p);
    };
    JWT.prototype.getSignature = function (msg) {
        var signature = sha256(this.key);
        signature.update(msg);
        return signature.digest("base64url");
    };
    return JWT;
}());
export { JWT };
function sha256(key) {
    return createHmac("sha256", key);
}
function base64Encode(msg) {
    return Buffer.from(msg).toString("base64url");
}
//# sourceMappingURL=JWT.js.map