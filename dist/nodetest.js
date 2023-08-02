import { JWT } from "./whendy/node/JWT.js";
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const jwt = new JWT({ key1: "your-256-bit-secret" });
const result = jwt.generate({ a: 1 });
console.log("result:", result);
//# sourceMappingURL=nodetest.js.map