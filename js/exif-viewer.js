import fs from "fs";
import path from "path";
import {
	promisify
} from "util";
import terminalKit from "terminal-kit";
import nodeEmoji from "node-emoji";
import exifTool from "exiftool";

const term = terminalKit.terminal;
const iconFolder = nodeEmoji.get("open_file_folder");
const iconFile = nodeEmoji.get("scroll");

const promiseReadDir = promisify(fs.readdir);
const promiseReadFile = promisify(fs.readFile);
const promiseMetadata = promisify(exifTool.metadata);

const isFolder = path => Boolean(fs.lstatSync(path).isDirectory());
const isFile = path => Boolean(fs.lstatSync(path).isFile());

const getExifImage = async file => {
	const data = await promiseReadFile(file);
	const metadata = await promiseMetadata(data);

	return metadata;
};

const getArrayOfFiles = async dirPath => {
	const filesNames = await promiseReadDir(dirPath);

	const files = Promise.all(filesNames.map(async file => {
		const metadata = await getExifImage(`${dirPath}/${file}`);

		return {
			icon: isFolder(`${dirPath}/${file}`) ? iconFolder : iconFile,
			isFolder: isFolder(`${dirPath}/${file}`),
			isFile: isFile(`${dirPath}/${file}`),
			path: `${dirPath}/${file}`,
			folder: `${dirPath}`,
			file: `${file}`,
			name: isFile(`${dirPath}/${file}`)
				? path.parse(file).name
				: "",
			exif: metadata
		};
	}));

	return files;
};

const createTableOfFiles = files => {
	term.table(
		[
			[
				"#",
				"icon",
				"name",
				"extension",
				"media create date",
				"creation date",
				"create date",
				"modify date"
			],
			...files.map((item, index) => {
				if (
					item.hasOwnProperty("icon") &&
					item.hasOwnProperty("name") &&
					item.hasOwnProperty("exif")
				) {
					return [
						index + 1,
						item.icon,
						item.name,
						item.exif.fileType,
						item.exif.mediaCreateDate,
						item.exif.creationDate,
						item.exif.createDate,
						item.exif.modifyDate
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
			width: 80,
			fit: true
		}
	);
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
					createTableOfFiles(files);
				}
			})(input);
		}
	});
};

export { getFolder };
