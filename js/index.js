import chalk from "chalk";
import nodeEmoji from "node-emoji";
import terminalKit from "terminal-kit";

const warning = chalk.hex("#FFA500");
const emojiRocket = nodeEmoji.get("rocket");
const term = terminalKit.terminal;

console.log(warning("Hello world!") + emojiRocket);

term.magenta("Enter your name: ");
term.inputField((error, input) => {
	term.green("\nYour name is '%s'\n", input);
});
