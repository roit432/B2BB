const Listing=require("./models/listing");
const {listingSchema,reviewSchema }=require("./schema.js");
const Reviews=require("./models/review.js");

const ExpressError=require("./utils/ExpressError.js");
module.exports.isLoggedin=(req,res,next)=>{
     //req.isAuthenticated() check that is user logged in we set to the false !
     if(!req.isAuthenticated()){
      
        req.session.redirectUrl=req.originalUrl;
        // console.log(req.user);//by default req store data
        req.flash("error","You must be logged in before creating listing");
       return res.redirect("/login");
      
        
      }
        
      next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;

  }
  next();
}
module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params
  let listing=await Listing.findById(id);//here we finding id from to the listing
  if( !listing.owner._id.equals(res.locals.currUser.id)){//and find to  the id exists or not
   req.flash("error","You are not owner of this listing!");
   return res.redirect(`/listings/${id}`);//if we dont return from this line then opertaion will be reperform
  }
  next();
}

//creating validation for to the listing schema
module.exports.validateListing=(req,res,next)=>{
  let {error} =listingSchema.validate(req.body);
    
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
}   


//creating validation schema for to the review validation schema
module.exports.validateReview=(req,res,next)=>{
  let {error} =reviewSchema.validate(req.body);
    
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
}

module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params
  let review=await Reviews.findById(id);//here we finding id from to the listing
  if( !review.author._id.equals(res.locals.currUser.id)){//and find to  the id exists or not
   req.flash("error","You Did not created this review!");
   return res.redirect(`/listings/${id}`);//if we dont return from this line then opertaion will be reperform
  }
  next();
}