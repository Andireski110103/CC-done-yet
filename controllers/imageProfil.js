const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  projectId: "andireski-110103",
  keyFilename: "credensial.json"
});

const bucketName = "andireski-110103.appspot.com";
const bucket = storage.bucket(bucketName);

const uploadImageToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No image file");
    }
    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (error) => {
      reject(error);
    });

    blobStream.on("finish", () => {
      // The public URL can be used to directly access the file via HTTP.
      const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });
};

const uploadImage = async (req, res) => {
  try {
    let file = req.file;
    if (!file) {
      return res.status(422).send({
        error: "file is required",
      });
    }

    const url = await uploadImageToStorage(file);

    return res.status(200).send({
      image: url,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
};

module.exports = {
  uploadImage,
};
