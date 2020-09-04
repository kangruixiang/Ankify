const path = require("path");
const dotenv = require("dotenv");

const envFile = path.resolve(__dirname, "..", ".env");

dotenv.config({
  path: envFile,
});

// const { attachmentFolder, ankiProfile, imgListFile } = config;

module.exports = {
  rootDir: process.env.ROOT_DIR,
  attachmentFolder: process.env.ATTACHMENT_FOLDER,
  ankiProfile: process.env.ANKI_PROFILE,
  cardLeft: process.env.CARD_LEFT,
  cardRight: process.env.CARD_RIGHT,
  delimiter: process.env.DELIMITER,
};
