import { Tool } from "./tool.js";
import { Whendy } from "./whendy.js";

const config = Tool.loadJsonFile("whendy/configuration/server.json");
const constants = Tool.loadJsonFile("whendy/configuration/constants.json");

const whendy = new Whendy({ ...config, constants });

whendy.start();