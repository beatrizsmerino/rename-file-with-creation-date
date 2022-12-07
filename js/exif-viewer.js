import fs from "fs";
import terminalKit from "terminal-kit";

const term = terminalKit.terminal;

const getFileList = async path => {
	const dir = await fs.promises.opendir(path);
	term.magenta(`\nThere are files inside:`);
	for await (const dirent of dir) {
		term.green(`\n${dirent.name}`);
	}
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
					await getFileList(path);
				}
			})(input);
		}
	});
};

export { getFolder };
