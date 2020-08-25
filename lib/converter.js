#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const showdown = require("showdown");

const card = require("./rules");

// initialize shodown
showdown.extension("anki", card.card);
const converter = new showdown.Converter({
  extensions: ["anki"],
});

// showdown options
converter.setOption("disableForced4SpacesIndentedSublists", true);
converter.setOption("ghCodeBlocks", true);
converter.setOption("noHeaderID", true);

// card preferences
const cardLeft = new RegExp("<!--", "g");
const cardRight = new RegExp("-->", "g");
const delimiter = "~";
let imageURL = /(?<=!\[.+\]\()(?!http)(.+)(?=.)/g;

// write data function
function writeData(outputFile, inputData) {
  // console.log(`Saving data to: ${outputFile}`);
  inputData = inputData + "\n";
  fs.appendFileSync(outputFile, inputData);
  // console.log(`Finished writing to ${outputFile}`);
}

// converts data from MD to HTML
function convertFile(input, output, attachmentFolder) {
  let mdContent = fs.readFileSync(input, "utf-8");

  mdContent = mdContent.replace(imageURL, (fullpath) => {
    // console.log(fullpath);
    return path.basename(fullpath);
  }); // replaces images with base image name

  htmlContent = converter.makeHtml(mdContent);

  let firstCard = "<!-- ignore -->";
  htmlContent = firstCard + htmlContent;
  htmlContent = htmlContent.replace(/~/g, ""); // cleans delimiter
  htmlContent = htmlContent.replace(/\n/g, ""); // replaces linebreak
  htmlContent = htmlContent.replace(cardLeft, "\n"); // replaces cardleft
  htmlContent = htmlContent.replace(cardRight, delimiter); // replaces cardright
  htmlContent = htmlContent.replace(/<p>/s, ""); // replaces beginning paragraph tag
  htmlContent = htmlContent.replace(/<\/p>/s, ""); // replaces end paragaph tag

  writeData(output, htmlContent);
}

module.exports = {
  convertFile,
};
