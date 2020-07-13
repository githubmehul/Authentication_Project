//jshint esversion:6
// In order to save sensitive info like encryption and API keys - configur Environment variables

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose')
// to encrypt the database
const encrypt = require('mongoose-encryption')

const app = express();
// to log api key
console.log(process.env.API_KEY);
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
// create a database
const userSchema = new mongoose.Schema({
  email :String,
  password :String
});


// put it before the user schema - to encrypt the password
userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password']});

const User = new mongoose.model("User" , userSchema);

app.get("/", function(req , res){
  res.render("home");
});
app.get("/login", function(req , res){
  res.render("login");
});
app.get("/register", function(req , res){
  res.render("register");
});
// catch the registration email and password
app.post("/register" , function(req , res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      // get the secrets page
      res.render("secrets");
    }
  });
});

// catch thelogin email and password
app.post("/login" , function(req , res){
  const username = req.body.username;
  const password = req.body.password;
// email should match the username and password should match
  User.findOne({email:username} , function(err , foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password ==password){
          res.render("secrets");
        }
      }
    }
  })
});




app.listen(3000 , function(){
  console.log("Succesfully Started");
})
