//this controller section control to the list
const Listing=require("../models/listing");

module.exports.index=async(req,res)=>{
    const allListings= await Listing.find({})//finding to the data
    // console.log(allListings);
    res.render("listings/index.ejs",{ allListings });
          
      }
module.exports.renderNewForm=(req,res)=>{
     
    res.render("listings/new.ejs")
  }

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;//when we use to the database in ejs wee need to use the (upper side liha h dekh le)
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{
      path:"author",
    }
  })
    .populate("owner");//finding to id in List and using populate method we can use or show the whole data of reviews in show route
    //if the listing does not exist then flash to the message
    if(!listing){
    req.flash("error","this listing is not available please look other option thank you!");
    res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});//rendering to the show.ejs and sending the List
  }
  module.exports.createListing=async(req,res,next)=>{
          let url=req.file.path;
          let filename=req.file.filename;
         
           //let {id,title,description,price ,location,country}=req.body;
       const newListing= new Listing(req.body.listing);//create a new instance
       newListing.owner=req.user._id;
       newListing.image={url,filename};
       await newListing.save();//saving to the data of list
       req.flash("success","Listing has been created!");
       res.redirect("/listings");//for direct in main page that is listing
     }

    module.exports.renderEditForm=async(req,res)=>{
  
        let {id}=req.params;//when we use to the database in ejs wee need to use the (upper side liha h dekh le)
        const listing=await Listing.findById(id);
        if(!listing){
          req.flash("error","this listing is not available please look other option thank you!");
          res.redirect("/listings");
          }
        res.render("listings/edit.ejs",{listing});
    
     }
    module.exports.updateListing=async(req,res)=>{
        let {id}=req.params;
       let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});//re constructing to the body
        if( typeof req.file!=="undefined!"){
       let url=req.file.path;
       let filename=req.file.filename;

       listing.image={url,filename};
       await listing.save();
        }

       req.flash("success","Listing is updated!"); 
           res.redirect(`/listings/${id}`);//by usin ${id} it take back to the show page where we update the liist
      }      
    module.exports.deleteListing=async(req,res)=>{
        let {id}=req.params;//requiring to the id
        const deletedListing=await Listing.findByIdAndDelete(id);//finding to the id and deleting from the database also
        console.log(deletedListing);//for terminal 
        req.flash("success","Listing has been deleted!");
        res.redirect("/listings");//redirect to the main page
     
      }

