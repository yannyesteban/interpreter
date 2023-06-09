import { Tool } from "./tool.js";
import { Whendy } from "./whendy.js";
const config = Tool.loadJsonFile("whendy/configuration/server.json");
const constants = Tool.loadJsonFile("whendy/configuration/constants.json");
const classElement = Tool.loadJsonFile("whendy/configuration/elements.json");
const db = Tool.loadJsonFile("whendy/configuration/bd.json");
const whendy = new Whendy(Object.assign(Object.assign({}, config), { constants, classElement, db }));
whendy.start();
//https://kinsta.com/blog/javascript-media-query/
//# sourceMappingURL=main.js.map