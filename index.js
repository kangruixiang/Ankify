#!/usr/bin/env node

const os = require("os");
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const processor_1 = require("./lib/processor");
const {
  rootDir,
  attachmentFolder,
  ankiProfile,
  cardLeft,
  cardRight,
  delimiter,
} = require("./lib/config");

// sets cards left and right, output file name
const cardLeft_1 = new RegExp(cardLeft, "g");
const cardRight_1 = new RegExp(cardRight, "g");
const outputFile = path.join(rootDir, "_html", "ankify.html");
const imgs = glob.sync(path.join(attachmentFolder, "*.{png,jpg,jpeg,gif}"));

// sets anki path based on system
if (os.platform() === "win32") {
  var ankiPath = path.join(process.env.APPDATA, ankiProfile);
} else {
  var ankiPath = path.join(
    process.env.HOME,
    "/Library/Application Support/",
    ankiProfile
  );
}

function createDir(name) {
  if (!fs.existsSync(path.join(rootDir, name))) {
    fs.mkdirSync(path.join(rootDir, name));
  }
}

function deletePreviousHtml(name) {
  try {
    fs.unlinkSync(name);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
}

function copyImg(imgs) {
  for (let img of imgs) {
    // copies to Anki folder

    let imgName = path.basename(img);
    let dest = path.join(ankiPath, imgName);
    if (!fs.existsSync(dest)) {
      fs.copyFileSync(img, dest);
      console.log("Copying to anki profile:", imgName);
    }
  }
}

function defaultMD(fileData) {
  let content = processor_1.default().process(fileData);
  return content;
}

async function main(mainFunc) {
  let files = glob.sync(path.resolve(rootDir, "*.md"));
  for (let file of files) {
    console.log("Converting:", file);
    try {
      let fileData = fs.readFileSync(file, "utf-8");
      let content = await mainFunc(fileData);

      let firstCard = "<!-- ignore -->";
      content = firstCard + content;
      content = content.replace(/~/g, ""); // cleans delimiter
      content = content.replace(/\n/g, ""); // replaces linebreak
      content = content.replace(/&#x3C;/g, "<"); // replaces left html comment
      content = content.replace(cardLeft_1, "\n"); // replaces cardleft
      content = content.replace(cardRight_1, delimiter); // replaces cardright
      fs.appendFileSync(outputFile, content);
    } catch (e) {
      console.log(e);
    }
  }
  console.log("Creating Anki card");
}

createDir("_html");
deletePreviousHtml(outputFile);
copyImg(imgs);
main(defaultMD);
