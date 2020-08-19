#!/usr/bin/env node

const showdown = require("showdown");
const card = require("./rules");
const { exception } = require("console");
const { readData, writeData } = require("./filesystem");

// imports anki card extension for showdown
showdown.extension("anki", card.card);

showdown.setOption("disableForced4SpacesIndentedSublists", true);

const converter = new showdown.Converter({
  extensions: ["anki"],
});

// const converter = new showdown.Converter();
converter.setOption("noHeaderId", true);
const cardLeft = new RegExp("<!--", "g");
const cardRight = new RegExp("-->", "g");
const delimiter = "~";

// converts data from MD to HTML
const convertFile = async (input, output) => {
  let mdContent = await readData(input);

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
};

module.exports = {
  convertFile,
};
