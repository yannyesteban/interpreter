import { Tool } from "./tool.js";
import { /*Socket as*/ Server } from "./server.js";
console.log("Welcome to Whendy V1.0");
const config = Tool.loadJsonFile("whendy/configuration/server.json");
const constants = Tool.loadJsonFile("whendy/configuration/constants.json");
const classElement = Tool.loadJsonFile("whendy/configuration/elements.json");
const db = Tool.loadJsonFile("whendy/configuration/bd.json");
const whendy = new Server(Object.assign(Object.assign({}, config), { constants, classElement, db }));
//whendy.start();
//https://kinsta.com/blog/javascript-media-query/
//# sourceMappingURL=main.js.map