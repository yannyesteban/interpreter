import { createHmac, timingSafeEqual } from "node:crypto"

const header = {
    alg: "HS256",
    typ: "JWT",
};

const payload = {
    "iss": "a_random_server_name",
    "exp": 1500,
    "name": "John Bobo",
    "email": "myemail@test.com",
    "isHuman": true
};

export class JWT {

    private key = "super_secret_society";

    constructor(opt){
        for(let key in opt){
            this[key] = opt[key];
        }
    }

    verify(token: string) {

        const parts = token.split(".");
        
        const signature = Buffer.from(parts[2]);
        const expected = this.getSignature(parts[0] + "." + parts[1]);
        
        if (timingSafeEqual(signature, Buffer.from(expected))) {
            return JSON.parse(Buffer.from(parts[1], "base64url").toString());
        }
        
        return null;
    }

    generate() {
        let h = base64Encode(JSON.stringify(header));
        let p = base64Encode(JSON.stringify(payload));

        return this.getSignature(h + "." + p);
    }

    getSignature(msg) {
        let signature = sha256(this.key);

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
