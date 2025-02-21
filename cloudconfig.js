const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


//here we are addimg to the env to the cloudconfig
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    cloud_key:process.env.CLOUD_API_KEY,
    cloud_secret:process.env.CLOUD_API_SECRET,

});


//definig to the storage

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder:"wanderlust_DEVE" ,
        allowedFormats: ["png", "jpg", "jpeg","gif"],
    },
});
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error("Missing Cloudinary configuration in environment variables");
}



  module.exports={
    cloudinary,
    storage,
  }
  