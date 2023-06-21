import { Tool } from "./tool.js";
import { Whendy } from "./whendy.js";
const config = Tool.loadJsonFile("whendy/configuration/server.json");
const constants = Tool.loadJsonFile("whendy/configuration/constants.json");
const classElement = Tool.loadJsonFile("whendy/configuration/elements.json");
const whendy = new Whendy(Object.assign(Object.assign({}, config), { constants, classElement }));
whendy.start();
//# sourceMappingURL=main.js.map