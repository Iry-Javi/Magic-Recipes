const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPIKEY,
    api_secret: process.env.CLOUDINARYSECRET,
    secure: true
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "recipe",
      allowedFormats: ["jpg", "png"],
      use_filename: true, 
      width: 300,
      height: 250,
    },
  });

  const uploadCloud = multer({ storage });

  module.exports = uploadCloud;