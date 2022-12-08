import fs from "fs";
import terminalKit from "terminal-kit";
import nodeEmoji from "node-emoji";

const term = terminalKit.terminal;
const iconFolder = nodeEmoji.get("folder");
const iconFile = nodeEmoji.get("file");

const isFolder = path => Boolean(fs.lstatSync(path).isDirectory());
const isFile = path => Boolean(fs.lstatSync(path).isFile());

const getArrayOfFiles = dirPath => {
	const filesNames = fs.readdirSync(dirPath);

	const files = filesNames.map(file => ({
		icon: isFolder(`${dirPath}/${file}`) ? iconFolder : iconFile,
		isFolder: isFolder(`${dirPath}/${file}`),
		isFile: isFile(`${dirPath}/${file}`),
		path: `${dirPath}/${file}`,
		folder: `${dirPath}`,
		file: `${file}`,
		name: isFile(`${dirPath}/${file}`) ? file.split(".").shift() : "",
		extension: isFile(`${dirPath}/${file}`) ? file.split(".").pop() : ""
	}));

	return files;
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
					const files = await getArrayOfFiles(path);
					term.table(
						[
							[
								"#",
								"icon",
								"file"
							],
							...files.map((item, index) => {
								if (
									item.hasOwnProperty("icon") &&
									item.hasOwnProperty("file")
								) {
									return [
										index + 1,
										item.icon,
										item.file
									];
								}
							})
						],
						{
							hasBorder: true,
							borderAttr: {
								color: "green"
							},
							firstRowTextAttr: {
								bgColor: "green"
							},
							borderChars: "lightRounded",
							width: 60,
							fit: true
						}
					);
				}
			})(input);
		}
	});
};

export { getFolder };
