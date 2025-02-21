const { required } = require("joi");
const mongoose=require("mongoose");//require to mongoose
const Schema=mongoose.Schema;//create var Schema to assign schema
const passportLocalMongoose=require("passport-local-mongoose");
//passport local mongoose already define to the username and also set to the password there is no requirement to add it


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    },
});

//plugin automatically perform username,hasing,salting and hashed password
userSchema.plugin(passportLocalMongoose);
//passing to the local mongoose as user
module.exports=mongoose.model("User",userSchema);