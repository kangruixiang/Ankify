const B2 = require("backblaze-b2");
const fs = require("fs");
const {
  applicationKeyId,
  applicationKey,
  bucketId,
  bucketName
} = require("./config");
const { stringify } = require("querystring");

console.log(applicationKeyId, applicationKey, bucketId, bucketName);

function b2login() {
  const b2 = new B2({
    applicationKeyId: applicationKeyId, // or accountId: 'accountId'
    applicationKey: applicationKey // or masterApplicationKey
  });
}


// gets upload information
async function getUpload() {
  try {
    await b2login.b2.authorize();
    let result = await b2.getUploadUrl({
      bucketId: bucketId
    });
    return result;
  } catch (err) {
    console.log(err);
  }
}

// gets all files
async function getFiles() {
  try {
    await b2login.b2.authorize();
    let fileNames = await b2.listFileNames({
      bucketId: bucketId,
      maxFileCount: 10
    });
    return fileNames;
  } catch (err) {
    console.log(err);
  }
}

function updateFile(imgName, imgListFile) {
  let data = fs.readFileSync(imgListFile, "utf-8");
  obj = JSON.parse(data);
  if (obj.includes(imgName)) {
    throw `${imgName} already exists on b2`;
  } else {
    console.log("Updating image list");
    obj.push(imgName);
    json = JSON.stringify(obj);
    fs.writeFileSync(imgListFile, json, "utf-8");
  }
}

// uploads a file
async function uploadFile(imgName, file, imgListFile) {
  try {
    // gets upload url and authorization
    let uploadInfo = await getUpload();
    let uploadURL = uploadInfo.data.uploadUrl;
    let authorizationToken = uploadInfo.data.authorizationToken;

    // reads file
    let data = fs.readFileSync(file);
    try {
      // checks for duplicates
      updateFile(imgName, imgListFile);
      // uploads file
      let result = await b2.uploadFile({
        uploadUrl: uploadURL,
        uploadAuthToken: authorizationToken,
        fileName: imgName,
        data: data // this is expecting a Buffer, not an encoded string
      });
      console.log(`Uploaded ${imgName}`);
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
}

// downloads a file
async function downloadFilebyName(fileName) {
  try {
    await b2login.b2.authorize();
    let result = await b2.downloadFileByName({
      bucketName: bucketName,
      fileName: fileName,
      responseType: "arraybuffer" // options are as in axios: 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
    });
    fs.writeFileSync(fileName, response.data);
    return result;
  } catch (err) {
    console.log(err);
  }
}

getFiles();

module.exports = {
  uploadFile
};
