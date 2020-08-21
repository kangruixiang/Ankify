const path = require("path");
const url = require("url");
const fs = require("fs");
const { b2Base } = require("./config");

// regex for image urls only
const imageURL = /(?<=!\[.+\]\()(?!http)(.+)(?=.)/g;

// writes data to file
function writeData(outputFile, inputData) {
  // console.log(`Saving data to: ${outputFile}`);
  inputData = inputData + "\n";
  fs.appendFileSync(outputFile, inputData);
  // console.log(`Finished writing to ${outputFile}`);
}

// replaces image urls in file
const replaceImgUrl = inputFile => {
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
};

module.exports = {
  writeData,
  replaceImgUrl
};
