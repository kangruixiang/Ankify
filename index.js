#!/usr/bin/env node

const os = require('os')
const path = require("path");
const fs = require("fs");
const commander = require("commander");
const glob = require("glob");
const url = require("url");

const { convertFile } = require("./lib/converter");
const { uploadFile } = require("./lib/b2");
const {
  rootDir,
  attachmentFolder,
  ankiProfile,
  imgListFile,
  b2Base,
} = require("./lib/config");

// commander settings for args
commander
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .option("-i, --image <path>", "image path", "")
  .option("-p, --path <path>", "markdown path", rootDir)
  .option("-u, --upload", "upload images", false)
  .parse(process.argv);

// sets md and image files
console.log(rootDir, commander.path, attachmentFolder, ankiProfile)

let files = glob.sync(path.join(commander.path, "*.md"));
let imgs = glob.sync(path.join(attachmentFolder, "*.{png,jpg,jpeg,gif}"));
let imageURL = /(?<=!\[.+\]\()(?!http)(.+)(?=.)/g;
if (os.platform() == 'win') {
  const ankiPath = path.join(process.env.APPDATA, ankiProfile);
} else {
  const ankiPath = path.join(process.env.HOME, '/Library/Application Support/', ankiProfile);
}

// defines output html file
let outputFile = path.join(
  commander.path,
  "_html",
  path.basename(rootDir) + ".html"
);

function replaceImgUrl(inputFile) {
  // replaces image urls in file to online url
  try {
    let fileData = fs.readFileSync(inputFile, "utf-8");
    let replacedData = fileData
      .toString()
      .replace(imageURL, (fullResult, imagePath) => {
        // console.log(`Replacing image urls in ${inputFile}`);
        const baseFile = path.basename(imagePath);
        const newImagePath = url.resolve(b2Base, baseFile);
        console.log(fullResult, imagePath, newImagePath);
        return `${newImagePath}`;
      });
    fs.writeFileSync(inputFile, replacedData);
  } catch (error) {
    console.log(error);
  }
}

// makes html folder
if (!fs.existsSync(path.join(commander.path, "_html"))) {
  fs.mkdirSync(path.join(commander.path, "_html"));
}

// deletes previous html file
try {
  fs.unlinkSync(outputFile);
} catch (e) {
  console.log(e);
}

for (let img of imgs) {
  // upload images and copies to Anki folder
  let imgName = path.basename(img);
  if (commander.upload) {
    uploadFile(imgName, img, imgListFile);
  } else {
    // copy images to anki profile
    fs.copyFileSync(img, path.join(ankiPath, imgName));
    console.log("Copying to anki profile:", imgName);
  }
}

// convert files to html
for (let file of files) {
  try {
    convertFile(file, outputFile);
  } catch (e) {
    console.log(e);
  }
  // replace image urls
  if (commander.upload) {
    replaceImgUrl(file);
  }

  // console.log(`Finished converting ${file}`);
}
