const mongoose=require("mongoose");//require to mongoose
const Schema=mongoose.Schema;//create var Schema to assign schema
const Reviews=require("./review");

   const listingSchema=new Schema({//creating schema for our database
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    image:{
       url:String,
       filename:String,
        
    },
        price:Number,
    country:String,
    location:String,
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
       type:Schema.Types.ObjectId,
       ref:"User",
    },
});

//creating a middle ware to delete the listing of review which was existing after deleting to the lisitng id
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Reviews.deleteMany({_id:{$in:listing.reviews}});//matching to the review id with to the listing id using $in operator and deleting
    }
   
})


const listing=mongoose.model("listing",listingSchema);//assign models to the listing 
module.exports=listing;//attention on the syntax


