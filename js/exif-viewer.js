import fs from "fs";
import terminalKit from "terminal-kit";
import nodeEmoji from "node-emoji";
import exifTool from "exiftool";

const term = terminalKit.terminal;
const iconFolder = nodeEmoji.get("open_file_folder");
const iconFile = nodeEmoji.get("scroll");

const isFolder = path => Boolean(fs.lstatSync(path).isDirectory());
const isFile = path => Boolean(fs.lstatSync(path).isFile());

const getExifImage = file => {
	fs.readFile(file, function(err, data) {
		if (err) {
			throw err;
		} else {
			exifTool.metadata(data, function(err, metadata) {
				if (err) {
					throw err;
				} else {
					const findKeyDate = Object.fromEntries(Object.entries(metadata).filter(([
						key
					]) => key.includes("mediaCreateDate") ||
								key.includes("creationDate")));

					console.log(findKeyDate);
				}
			});
		}
	});
};

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
		extension: isFile(`${dirPath}/${file}`) ? file.split(".").pop() : "",
		exif: getExifImage(`${dirPath}/${file}`)
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
					const files = await getArrayOfFiles(path);
					term.magenta("\nThere are %s files inside:\n", files.length);
					term.table(
						[
							[
								"#",
								"icon",
								"file",
								"exif"
							],
							...files.map((item, index) => {
								if (
									item.hasOwnProperty("icon") &&
									item.hasOwnProperty("file") &&
									item.hasOwnProperty("exif")
								) {
									return [
										index + 1,
										item.icon,
										item.file,
										item.exif
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
