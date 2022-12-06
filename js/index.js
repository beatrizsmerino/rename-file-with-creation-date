import chalk from "chalk";
import nodeEmoji from "node-emoji";

const warning = chalk.hex("#FFA500");
const emojiRocket = nodeEmoji.get("rocket");

console.log(warning("Hello world!") + emojiRocket);
