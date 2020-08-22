const fs = require("fs");
const path = require("path");
const commander = require("commander");

commander
  .version("1.0.0", "-v, --version")
  .usage("[OPTIONS]...")
  .option("-i, --image <path>", "image path", "")
  .option("-p, --path <path>", "markdown path", process.cwd())
  .option("-u, --upload", "upload images", false)
  .parse(process.argv);

let rawconfig = fs.readFileSync(path.join(commander.path, "config.json"));
let config = JSON.parse(rawconfig);
const { attachmentFolder, ankiProfile, imgListFile } = config;

console.log(attachmentFolder);
console.log(ankiProfile);
console.log(imgListFile);
