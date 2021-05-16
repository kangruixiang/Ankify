const os = require("os");
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const rootDir = "D:\\Drive\\My-Notes\\";
const file =
  "D:\\Drive\\My-Notes\\03 Resources\\Relationships\\Friends\\Angela Voung.md";

console.log(files);

let source = rootDir.replace(
  rootDir,
  `obsidian://open?vault=${vaultName}&file=`
); // obsidian url of file
source = `<a href="${source}">source</a>`;
console.log(source);
