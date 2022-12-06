import chalk from "chalk";
import emoji from "node-emoji";

const warning = chalk.hex("#FFA500");
const rocket = emoji.get("rocket");

console.log(warning("Hello world!") + rocket);
