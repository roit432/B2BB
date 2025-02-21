const express=require("express");
const router=express.Router({mergeParams:true});//mergePrams is used for to connect with  parent and it give paramteres to the child like id
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,  reviewSchema }=require("../schema.js");
const Listing=require("../models/listing.js");//require to the folder models and files liting.js
const Reviews=require("../models/review.js");
const { validateReview, isLoggedin, isReviewAuthor }=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");

//whenever we require parameter which could be used then we use to the mergeparams




 //Reviews
  //Post  reviews ROute
  //passing to the validateREview middleware
  //passing to the wrapAsync as error handler
  router.post("/",
    isLoggedin,
    validateReview,
    wrapAsync(reviewController.createReview));
  //delete route of the reviews
  //creating delete route for to the deleting to thee reviews
  router.delete("/:reviewId",
    isLoggedin,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));



  module.exports=router;