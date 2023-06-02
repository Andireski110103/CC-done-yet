const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadController = require("../controllers/imageProfil");

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

router.post("/uploadProfil", multerUpload.single("file"), (req, res) => {
    uploadController.uploadImage(req, res);
});

module.exports = router;
