import { Tool } from "./tool.js";
import * as WH from "./whendy.js";
const config = (Tool.loadJsonFile("whendy/node/server.json"));
///console.log(config)
const wh = new WH.Whendy(config);
wh.start();
//# sourceMappingURL=main.js.map