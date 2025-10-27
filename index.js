const express = require("express");
const app = express();

const fs = require("fs");
const PORT = 8000;
const mongoose = require('mongoose');


// building schema

// connecting the database url
mongoose.connect("mongodb://127.0.0.1:27017/kajukatli-app-1").then(() => console.log("MongoDB connected")).catch((err) => console.log("poop hogyi", err));

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
    },
    lastName : {
        type : String,
        required : false,
    },
    email :{
       type : String,
       required : true,
       unique:true,
    },
    jobTitle : {
        type : String,
        required : true,
    },
    
    gender : {
        type: String,
    },


} , {timestamps : true}); // this will give a reference of timings about when is this gonna start 
// defining the time limit of when is this starting and when is this gonna end

const User = mongoose.model('user' , userSchema)
// middleware-plugin addition of middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Route to get all users
app.get('/api/users', async(req, res) => {
    const allDbUsers = await User.find({});
    return res.json(allDbUsers); // <-- send your JSON data here
});




app.post("/api/users" , async (req , res) => {
    // TODO : Create new user
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.gender
        || !body.email || !body.job_title
    ){
        return res.status(400).json({ msg : "All fields are required"});
    }
    const result = await User.create({
        firstName: body.first_name,
        lastName: body.last_name ,
        email: body.email ,
        gender: body.gender ,
        jobTitle : body.job_title ,


    });
    return res.status(200).json({msg : "success"});
});



app.route("/api/users/:id").get(async (req , res) => {

    
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404);
    return res.json(user);
}).patch(async(req,res) => {
    // edit user
    await User.findByIdAndUpdate(req.params.id , { lastName : "Changed"});

   return  res.json({status : "Pending"});
}).delete(async(req,res) => {

    // delete the user with that specific id 
     await User.findByIdAndDelete(req.params.id);
      return  res.json({status : "Pending"});
});





// BY DEFAULT THE BROWSER PERFORMS GET , POST , PUT , PATCH AND DELETE REQUEST , THEREBY IT BECOMES DIFFICULT TO HANDLE OTHER TYPES OF REQUEST 
app.listen(PORT, () => console.log(`Server Started At PORT: ${PORT}`)); 






