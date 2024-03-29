//import exp from "node:constants";
import { createHmac, timingSafeEqual } from "node:crypto"

export class JWT {

    private header = {
        alg: "HS256",
        typ: "JWT",
    }

    private payload = {

    }

    private key = "your-256-bit-secret";

    constructor(opt?:any) {
        for (let key in opt) {
            this[key] = opt[key];
        }
    }

    verify(token: string) {

        const parts = token.split(".");

        if(parts[2]){
            const signature = Buffer.from(parts[2]);
            const expected = Buffer.from(this.getSignature(parts[0] + "." + parts[1]));
    
            if (Buffer.byteLength(signature) == Buffer.byteLength(expected) && timingSafeEqual(signature, expected)) {
                return JSON.parse(Buffer.from(parts[1], "base64url").toString());
            }
        }
        

        return null;
    }

    generate(payload) {

        const h = base64Encode(JSON.stringify(this.header));
        const p = base64Encode(JSON.stringify(payload));

        return h + "." + p + "." + this.getSignature(h + "." + p);
    }

    getSignature(msg) {
        const signature = sha256(this.key);

        signature.update(msg);
        return signature.digest("base64url");
    }
}

function sha256(key) {
    return createHmac("sha256", key);
}

function base64Encode(msg) {
    return Buffer.from(msg).toString("base64url");
}
