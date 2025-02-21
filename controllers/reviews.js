//creating or reformatting to the review 

const Listing=require("../models/listing.js");//require to the folder models and files liting.js
const Reviews=require("../models/review.js");

module.exports.createReview=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Reviews(req.body.review);//after creating review schema storing it in newReview
    newReview.author=req.user._id;//every review has a author associated with it
    console.log(newReview);
    listing.reviews.push(newReview);//add to the reviews in listings and after it pushing to the new reviews in listing databse
    await newReview.save();//save to the new review
    await listing.save();//saving to the listing database
    req.flash("success","New review has been created!");
    console.log(newReview);
      
      res.redirect(`/listings/${listing._id}`);//after submitting review it redirect to the that particular page
  }

module.exports.deleteReview=async(req,res)=>{
    let {id ,reviewId}=req.params;//extract to the review id  and listing id from body
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//extracting to the review id from review array by mongo $pull operator and updating it in to the listing id
    await  Reviews.findByIdAndDelete(reviewId);//finding to the review id ad deleting from to the Revies sechma
    req.flash("success"," Review has been Deleted!");
    res.redirect(`/listings/${id}`);
}  