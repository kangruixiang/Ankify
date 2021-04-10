const os = require("os");
const path = require("path");
const fs = require("fs");
const glob = require("glob");

const rootDir = glob.sync(
  "D:\\Drive\\My-Notes\\03 Resources\\Medicine" + "**/*.md"
);

let dir2 = glob.sync(
  "D:\\Drive\\My-Notes\\03 Resources\\Medicine\\01 Step 1" + "**/*.md"
);
let dir3 = glob.sync(
  "D:\\Drive\\My-Notes\\03 Resources\\Medicine\\02 Step 2" + "**/*.md"
);

let files = set(rootDir);
console.log(files);
