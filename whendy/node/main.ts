import { Tool } from "./tool.js";
import { Whendy } from "./whendy.js";
import { getClass, register } from "./classManager.js";

const config = Tool.loadJsonFile("whendy/configuration/server.json");
const constants = Tool.loadJsonFile("whendy/configuration/constants.json");
const classElement = Tool.loadJsonFile("whendy/configuration/elements.json");

const whendy = new Whendy({ ...config, constants, classElement });

whendy.start();