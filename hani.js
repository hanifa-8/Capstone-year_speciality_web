const express = require("express");
const app = express();
const bcrypt = require('bcrypt');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var admin = require("firebase-admin");
var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/project/login-62da0/firestore",
});

const db = getFirestore();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 

app.get("/signup", function(req, res) {
  res.sendFile(__dirname + "/public/" + "signup.html");
});

app.get("/home", function(req, res) {
  res.sendFile(__dirname + "/public/" + "home.html");
});

app.get("/login", function(req, res) {
  res.sendFile(__dirname + "/public/" + "login.html");
});

app.post("/signupSubmit", async function(req, res) {
  const { Username, Email, Password } = req.body; 

  const emailExists = await checkingEmail(Email);

    if (emailExists) {
       
        res.send('<p style="color: #87CEEB; font-size: 25px; text-align: center; background-color: black; padding: 400px">EMAIL ALREADY EXIST !! PLEASE LOGIN!!</p>');

    } else {
     
        const hashedPassword = await bcrypt.hash(Password, 10);

        db.collection('students').add({
           Username: Username,
           Email: Email,
           Password: hashedPassword 
        })
        .then(()=>{
            res.send('<p style="color: #87CEEB; font-size: 25px; text-align: center; background-color: black; padding: 400px">DEAR USER YOU ARE SUCCESSFULLY SIGNED IN.NOW PLEASE LOGIN TO CONTINUE.</p>');
  
        });
    }
});

async function checkingEmail(Email) {
    const firebaseData= await db.collection('students')
        .where("Email", "==", Email)
        .get();
    return !firebaseData.empty;
}



app.post("/logingIn", function(req, res) {
  const { Email, Password } = req.body; 

  db.collection('students')
    .where("Email", "==", Email)
    .get() 
    .then(async (collectionData) => {
        if(collectionData.empty){
            res.send('<p style="color: #87CEEB; font-size: 25px; text-align: center; background-color: black; padding: 400px">USER NOT FOUND!!!</p>');
        }
        else{
            const user = collectionData.docs[0].data();
            const hashedPassword = user.Password;

  
            const passwordMatch = await bcrypt.compare(Password, hashedPassword);
            if (passwordMatch) {
                res.redirect("/home");

            } else {
                res.send('<p style="color: #87CEEB; font-size: 25px; text-align: center; background-color: black; padding: 400px">OOPS!.......LOGIN NOT SUCCESSFUL</p>');
                
            }
        }    
    });
});

app.get("/home", function(req, res) {
  db.collection('students').add({

  }).then(() => {
    res.send("");
  });
});

app.listen(3000, function() {
  console.log('Your port 3000 is connected');
});

