//jshint esversion:6
//require("dotenv").config();
const env = require("dotenv");
env.config();
const encrypt = require("mongoose-encryption");
const express = require("express");
// const app = require("express")();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));


//Notes:  ---create mongodb connection first through mongoose, then a schema, then a mongoose model5
// local database connection
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// this schema is now an object created from the mongoose schema class
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

//home routes

app.get("/", function(req, res){
    res.render("home.ejs");
});

app.get("/login", function(req, res){
    res.render("login.ejs");
});

app.get("/register", function(req, res){
    res.render("register.ejs");
});

// post routes
app.post("/register", function(req, res){
    const newUser = new User ({
        email: req.body.username,
        password: req.body.password,
    });

    newUser.save(function(err){
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });

});

// app.post("/login", function(req, res){
//     const username = req.body.username;
//     const password = req.body.password;

//     User.findOne({email: username}, function(err, foundUser){
//         if (err) {
//             console.log(err);
//         } else if (foundUser) {
//                 if (foundUser.password === password) {
//                     res.render("secrets");
//             }
//         }
        
//     });
// });

// fat arrow function 
app.post("/login", (req, res) => {
    // object destructuring
    const {username, password} = req.body;
    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
            return;
        } else if (foundUser && foundUser.password === password) {
            res.render("secrets");
        } else {
            res.render("home");
        }
    });
});


app.listen(3000, function(){
    console.log("server started on port 3000")
});

