import fs from "fs";
import terminalKit from "terminal-kit";

const term = terminalKit.terminal;

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
				const isFolder = fs.lstatSync(path).isDirectory();
				if (!isFolder) {
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
