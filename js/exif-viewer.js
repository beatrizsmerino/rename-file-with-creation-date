import fs from "fs";
import terminalKit from "terminal-kit";

const term = terminalKit.terminal;

const isFolder = path => Boolean(fs.lstatSync(path).isDirectory());
const isFile = path => Boolean(fs.lstatSync(path).isFile());

const getArrayOfFiles = dirPath => {
	const files = fs.readdirSync(dirPath);
	console.log(files);
};

const getFolder = () => {
	term.magenta("Enter the path to your folder: ");

	term.inputField((error, input) => {
		if (error) {
			console.log("Error:", error);
			process.exit();
		} else {
			(async path => {
				if (!isFolder(path)) {
					process.exit();
				} else {
					term.green("\nYour folder selected is '%s'\n", path);
					term.magenta(`\nThere are files inside:\n`);
					await getArrayOfFiles(path);
				}
			})(input);
		}
	});
};

export { getFolder };
