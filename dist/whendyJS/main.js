import { Tool } from "./tool.js";
import { /*Socket as*/ Server } from "./server.js";
console.log("Welcome to Whendy V1.0");
const config = Tool.loadJsonFile("./app/configuration/server.json");
const constants = Tool.loadJsonFile("./app/configuration/constants.json");
const classElement = Tool.loadJsonFile("./app/configuration/elements.json");
const db = Tool.loadJsonFile("./app/configuration/bd.json");
const whendy = new Server(Object.assign(Object.assign({}, config), { constants, classElement, db }));
//whendy.start();
//https://kinsta.com/blog/javascript-media-query/
//# sourceMappingURL=main.js.map