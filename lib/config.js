const path = require("path");
const dotenv = require("dotenv");

const envFile = path.resolve(__dirname, "..\\.env");

dotenv.config({
  path: envFile
});

// console.log(process.env.ROOT_DIR);
// console.log(process.env.ATTACHMENT_FOLDER);
// console.log(process.env.ANKI_PROFILE);

// const rootDir = process.env.ROOT_DIR;
// const attachmentFolder = process.env.ATTACHMENT_FOLDER;
// const ankiProfile = path.resolve(process.env.APPDATA, process.env.ANKI_PROFILE);

module.exports = {
  rootDir: process.env.ROOT_DIR,
  attachmentFolder: process.env.ATTACHMENT_FOLDER,
  ankiProfile: process.env.ANKI_PROFILE,
  imgListFile: process.env.IMG_LIST_FILE,

  applicationKeyId: process.env.API_KEY_ID,
  applicationKey: process.env.API_KEY,
  bucketId: process.env.BUCKET_ID,
  b2Base: process.env.B2_BASE,
  bucketName: process.env.BUCKET_NAME
};
