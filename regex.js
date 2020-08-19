const path = require("path");
const url = require("url");

const imageURL = /(?<=!\[.+\]\()(.+)(?=.)/g;
// const imageURL = /\]\((.+)(?=.)/g;

string = "![test image](https://google.com)";

replacedData = string.replace(imageURL, (fullResult, imagePath) => {
  const baseFile = path.basename(imagePath);
  const newImagePath = url.resolve("http://www.example.org", baseFile);
  //   console.log(fullResult, imagePath, baseFile, newImagePath);
  return `${newImagePath}`;
});

console.log(replacedData);
