const express = require("express");
const app =express();
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');

var admin = require("firebase-admin");

var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:"https://console.firebase.google.com/project/login-62da0/firestore",
 
});

const db = getFirestore();

app.use(express.static("public"));

app.get("/signup", function(req, res){
    res.sendFile(__dirname + "/public/" + "signup.html");
});

app.get("/home", function(req, res){
    res.sendFile(__dirname + "/public/" + "home.html");
});

app.get("/login", function(req, res){
    res.sendFile(__dirname + "/public/" + "login.html");
});


app.get("/signupSubmit", function(req, res){
    db.collection('students').add({
        Username: req.query.Username,
        Email: req.query.Email,
        Password: req.query.Password
    }).then(()=>{
        res.send('<p style="color: #87CEEB; font-size: 25px; text-align: center; background-color: black; padding: 400px">Dear user you are successfully signed in.Now please login to continue.... </p>');

    })
});



app.get("/logingIn", function(req, res){
    db.collection('students')
    .where("Email", "==", req.query.Email)
    .where("Password", "==", req.query.Password)
    .get()
    .then((data)=>{
        if(data.empty){
            res.send("Not Successfull")
        }
        else{
            res.redirect("/home")
        }
    })
    
});


app.get("/home", function(req, res){
    db.collection('students').add({

    }).then(()=>{
        res.send("")
    })
});

app.listen(3000,function(){
    console.log('your port 3000 is connected')
});