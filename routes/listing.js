const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");//require to the folder models and files liting.js
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,  reviewSchema }=require("../schema.js");
const Reviews=require("../models/review.js");

const { isLoggedin } = require("../middleware.js");
const { isOwner }=require("../middleware.js");
const { validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require("multer");//Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files
const {storage}=require("../cloudconfig.js");
const upload = multer({ storage });//multer will store the files in storage


//when a file is outside like app.js then we require to the files with other folder by using single " . "
//if we want to require to the files then we use to the double " .. "





//creating index route for the database
//isloogedin middlware create for to the user authentication
router.get("/",wrapAsync(listingController.index));
  
       //new route
    router.get("/new",isLoggedin,listingController.renderNewForm);
  
      //show route
      //isloogedin middlware create for to the user authentication
    router.get("/:id",isLoggedin,wrapAsync(listingController.showListing)) ;
  
  
    //create route
    //isloogedin middlware create for to the user authentication
    router.post("/",
      isLoggedin,
      
      upload.single("listing[image]"),
      validateListing,
      wrapAsync(listingController.createListing)
    );
   
      // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any

  //edit route
  //isloogedin middlware create for to the user authentication
  //isOwner checks to the authentication of the user
  router.get("/:id/edit",isLoggedin,wrapAsync(listingController.renderEditForm));
 //update route
 //isloogedin middlware create for to the user authentication
 router.put("/:id",
  isLoggedin,
  isOwner,
  upload.single("listing[image]"),//multer first parse the image then it will saved in cloudinary
  validateListing,
  wrapAsync(listingController.updateListing));
 //delete route
 //isloogedin middlware create for to the user authentication
 router.delete("/:id",isLoggedin,isOwner,wrapAsync(listingController.deleteListing));

 module.exports=router;
