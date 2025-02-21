const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";//create data base name and server

main().then(()=>{// calling to the main() function 
    console.log("connected to the DB");
}).catch((err)=>{
    console.log(err);
})


async function main(){//create async function
    await mongoose.connect(MONGO_URL);//connect with the mongoose
}

//in starting clear to the data from function by async()
const initDB=async()=>{
    await listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj,owner:"6757c68e2f4a2a5f518e554a"}));
    await listing.insertMany(initData.data);//data is in object form so accessing by .data
    console.log("Data was initialized");
}

initDB();//calling to the init function 