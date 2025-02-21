if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}


//NOTE---The Cloudinary Node SDK allows you to quickly and easily integrate your application with Cloudinary.
//Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
const express=require("express");//require to the express
const app=express();//use to app 
const mongoose=require("mongoose");//require to the mongoose
const Listing=require("./models/listing.js");//require to the folder models and files liting.js
const path=require("path");//require to the path for files
const methodOverride=require("method-override");//require to the method-override
const ejsMate=require("ejs-mate");//require to the ejs-mate
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");

const Reviews=require("./models/review.js");
const listing = require("./models/listing.js");
const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const  session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");//it require for authentication
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");//require to the user schema
const { isLoggedin }=require("./middleware.js");




 //create data base name and server
 const dbUrl=process.env.ATLASDB_URL

main().then(()=>{// calling to the main() function 
    console.log("connected to the DB");
}).catch((err)=>{
    console.log(err);
})



async function main(){//create async function
    await mongoose.connect(dbUrl);//connect with the mongoose
}


app.set("view engine","ejs");//starting engine for views folder
app.set("views",path.join(__dirname,"views"));//accessing to the ejs
app.use(express.urlencoded({extended:true}));//it use for to the parsing from where data is coming through our API
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);//using to the ejs mate
app.use(express.static(path.join(__dirname,"/public")));//using to the css from boiler plate 

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",()=>{
  console.log("ERROR in MONGO SESSION STORE",err);
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
     expires:Date.now()+7*24*60*60*1000,
     maxAge:7*24*60*60*1000,
     httpOnly:true,
  }
}
// app.get("/",(req,res)=>{//create API for the root checking
//   res.send("Root is working");
// });

app.use(session(sessionOptions));
app.use(flash());//we have to the flash middleware beacuse by the helps of the routes we render to the flash
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//here in this line of code  every user should authenticate through localstrategy (login or sign up)
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());// we store the information about user i.e serializerUser
passport.deserializeUser(User.deserializeUser());//we remoe information



 //created a middleware for flash to render the message and store success array to locals by req.flash
 //here local res.locals are use fot to store the information of the current session
 app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;//here currUser store to the information which is related to the user
  // console.log(res.locals.success);  
  next();
});
// app.get("/demouser",async(req,res)=>{
//   let fakeuser=new User({
//     email:"rohitsonkar4372@gmail.com",
//     username:"Rohit Sonkar"
//   })
//   let registeredUser=await User.register(fakeuser,"Billu@8896");//it is a convieniance method to register a new user
//   console.log(registeredUser);
//   res.send(registeredUser);
// });




  app.use("/listings",listingRouter);
  app.use("/listings/:id/reviews",reviewsRouter);
  app.use("/",userRouter);
  

 
 


app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something went wrong"}=err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});
app.listen(8080,()=>{//root for the port
    console.log("Server is listening to Port 8080");
});