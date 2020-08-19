#!/usr/bin/env node

const path = require("path");
const fs = require("fs");
const commander = require("commander");
const glob = require("glob");
const { convertFile } = require("./converter");
const { makeDir, readData, writeData, replaceImgUrl } = require("./filesystem");
const { write } = require("fs");
const { uploadFile } = require("./b2");

// loads env config
require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

const rootDir = process.env.ROOT_DIR;
const attachmentFolder = process.env.ATTACHMENT_FOLDER;
const ankiProfile = path.resolve(process.env.APPDATA, process.env.ANKI_PROFILE);

// commander settings for args
commander
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .option("-i, --image <path>", "image path", "")
  .option("-p, --path <path>", "markdown path", process.cwd())
  .parse(process.argv);

// main commands
let main = async () => {
  // upload images\

  let imgs = glob.sync(path.join(attachmentFolder, "*.{png,jpg,jpeg,gif}"));

  console.log("copying images to anki profile folder");

  for (let img of imgs) {
    try {
      imgName = path.basename(img);
      // uploadFile(imgName, img, imgListFile);
      // fs.copyFileSync(img, path.join(ankiProfile, imgName)); // copy images to anki profile
      console.log(ankiProfile);
    } catch (e) {
      console.log(e);
    }
  }

  // makes html folder
  makeDir(path.join(rootDir, "_html"));

  // find all md files
  let files = glob.sync(path.join(commander.path, "*.md"));

  // creates output html
  let outputFile = path.join(
    rootDir,
    "_html",
    path.basename(process.cwd()) + ".html"
  );

  // deletes previous html file
  try {
    fs.unlinkSync(outputFile);
  } catch (e) {
    console.log(e);
  }

  // convert files to html
  for (let file of files) {
    try {
      await convertFile(file, outputFile);
    } catch (e) {
      console.log(e);
    }
    // replace image urls
    // replaceImgUrl(file);
    console.log(`Finished converting ${file}`);
  }
};

main();
