const User=require("../models/user.js");
const passport = require("passport");
//reformatting to the code
module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;//extracting username email password from body of signup
        const newUser=new User({username,email});//passig to the username and email to the newUSer
        const registeredUs=await User.register(newUser,password);//registering to the username and email
        console.log(registeredUs);
        //passport gives a built in function res.login which automatically triggred after sign up then using that
        //if we do not want to login page after sign up then it will use ful beacuse it clear the req.user after this callback
        req.login(registeredUs,(err=>{
            if(err){
                return next(err);
            }
            req.flash("success","User was registered");//flashing to the messages after successfully login 
            res.redirect("/listings");//redirect to the listing route
        }));
        
    }catch(e){
        req.flash("error",e.message);//if there error occurs then it shows the error msg
        res.redirect("/signup");
    }
    
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("user/login.ejs")

}
//this code is work after login in website
module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wandelust you are logged in!");
  let redirectUrl=res.locals.redirectUrl || "/listings"; //if checks url empty or not otherwise redirct to the listings
  res.redirect(redirectUrl);
}

//for logout
module.exports.logOut=(req,res,next)=>{
    //req.logOut takes itself callback and return it 
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    })
 }