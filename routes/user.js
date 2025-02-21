const express=require("express");
const router=express.Router();//mergePrams is used for to connect with  parent and it give paramteres to the child like id
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/users.js");
router.get("/signup",userController.renderSignupForm);
router.post("/signup",wrapAsync(userController.signup));
router.get("/login",userController.renderLoginForm);
//here passport.authenticate()  middleware check from to the databse user details it is exist or not if it failure to login then it will redirect to the login page
//failureFlash:true middleaware it refers that if the login failed then it will show to the mesg
//
router.post("/login",
    saveRedirectUrl
     ,passport.authenticate("local"
        ,({failureRedirect:"/login" 
            ,failureFlash:true}))
            ,userController.login);
 router.get("/logout",userController.logOut);

module.exports=router;