#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const commander = require("commander");
const glob = require("glob");
const url = require("url");

const { convertFile } = require("./lib/converter");
const { uploadFile } = require("./lib/b2");

// commander settings for args
commander
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .option("-i, --image <path>", "image path", "")
  .option("-p, --path <path>", "markdown path", process.cwd())
  .option("-u, --upload", "upload images", false)
  .parse(process.argv);

// loads settings
let rawconfig = fs.readFileSync(path.join(commander.path, "config.txt"));
let config = JSON.parse(rawconfig);
const {
  attachmentFolder,
  ankiProfile,
  imgListFile,
  applicationKeyId,
  applicationKey,
  bucketId,
  bucketName
} = config;

// sets md and image files
let files = glob.sync(path.join(commander.path, "*.md"));
let imgs = glob.sync(path.join(attachmentFolder, "*.{png,jpg,jpeg,gif}"));
let imageURL = /(?<=!\[.+\]\()(?!http)(.+)(?=.)/g;

// defines output html file
let outputFile = path.join(
  commander.path,
  "_html",
  path.basename(process.cwd()) + ".html"
);

function uploadImage(img) {
  // upload images
  console.log("Uploading", img);

  try {
    imgName = path.basename(img);
    uploadFile(imgName, img, imgListFile);

    // console.log(ankiProfile);
  } catch (e) {
    console.log(e);
  }
}

function replaceImgUrl(inputFile) {
  // replaces image urls in file
  try {
    let fileData = fs.readFileSync(inputFile, "utf-8");
    let replacedData = fileData
      .toString()
      .replace(imageURL, (fullResult, imagePath) => {
        console.log(`Replacing image urls in ${inputFile}`);
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

console.log(imgs);
for (let img of imgs) {
  // upload images and copies to Anki folder
  if (commander.upload) {
    uploadImage(img);
  } else {
    // copy images to anki profile
    // fs.copyFileSync(img, path.join(ankiProfile, imgName));
    console.log("copying to anki profile", ankiProfile);
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

  console.log(`Finished converting ${file}`);
}
