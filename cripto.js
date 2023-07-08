import * as crypto from "node:crypto"



let hash = crypto.createHash('md5').update('123').digest("hex")

console.log(hash)

hash = crypto.createHash('sha1').update('contraseniaSHA1').digest("hex")

console.log(hash)

hash = crypto.createHash('sha256').update('abc').digest("hex")

console.log(hash)