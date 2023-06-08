import { JWT } from "./core/JWT.js";
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
var jwt = new JWT({ key1: "your-256-bit-secret" });
var result = jwt.generate();
console.log("result:", result);
//# sourceMappingURL=nodetest.js.map