// uploads images to firebase storage and replaces in current files
const { Storage } = require("@google-cloud/storage");
const { findFiles } = require("./filesystem");

// creates new storage client and bucket
const storage = new Storage();
const bucket = storage.bucket("gs://krx-notebook.appspot.com");

// uploads file
const uploadFile = async (file) => {
  try {
    let options = {
      destination: "wiki/" + file,
    };
    await bucket.upload(file, options);
    console.log(`${file} uploaded.`);
  } catch (e) {
    throw e;
  }
};

// list files from bucket
const listFile = async () => {
  let [files] = await bucket.getFiles();

  console.log("Files:");
  files.forEach((file) => {
    console.log(file.name);
  });
};

//deletes files
const deleteData = (id) => {
  db.collection("test").doc(id).delete();
};

// downloads files
const downloadFile = async () => {
  let options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: "test.jpg",
  };
  await bucket.file("L2ARGroup.jpg").download(options);

  console.log(`finished`);
};

// uploads image files
const uploadImages = () => {
  let imgFiles = findFiles("images", "+(jpg|jpeg|gif|png|JPG)");
  // const images = imgFiles.map((file) => file.split("/").pop());
  console.log(imgFiles);
  imgFiles.forEach((file) => {
    uploadFile(file);
  });
};

const generateSignedUrl = async (filename) => {
  // These options will allow temporary read access to the file
  const options = {
    version: "v2", // defaults to 'v2' if missing.
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // one hour
  };

  // Get a v2 signed URL for the file
  let [url] = await bucket.file(filename).getSignedUrl(options);

  console.log(`The signed url for ${filename} is ${url}.`);
};

generateSignedUrl("images/2020-03-19 09.55.50 4.jpg");
