
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require("express-session")
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { response } = require('express')
const MongoClient = require('mongodb').MongoClient;

const SESSION_LENGTH = 1_800_000;  // = 30 minutes in ms
const URI = "mongodb+srv://devapp:wintermute3000@cluster0.val9t.mongodb.net/TestDatabase"
  + "?retryWrites=true&w=majority";

app.use(session({ secret: 'compsci320', maxAge: SESSION_LENGTH }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());

//recognitiom and employee structure
var recognitions = {
  recognizer: null,
  recognizee: null,
  core: null,
  message: null,
}

var employee = {
    _id: null,
    firstName: null,
    lastName: null,
    companyId: null,
    password: null,
    positionTitle: null,
    companyName: null,
    isManager: null,
    employeeId: null,
    managerId: null,
    email: null,
    startDate: null,
    recognitionsGiven: null,
    recognitionsReceived: null
}

// Calling passport.use tells Passport to run this code to match a username and
// password to a user.
//    See http://www.passportjs.org/docs/configure/
passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async function(username, password, done) {
      const client = new MongoClient(URI);
      try {
          await client.connect();
          var dbo = client.db("Test-Database");
          dbo.collection("TestEmployees").findOne({email: username}, function(err, result) {
          if( result ==null){
            return done(null, false, {
              message: 'WIP, use username = "username" and password = "password"'
            });
          }
                // TODO: When connected with database, actually look up a user.
          if (username === result.email && password === result.password) {
          // We would want to return a user from the database here
            return done(null, result);
          }

          // Returning done with false indicates that the credentials were incorrect
          return done(null, false, {
            message: 'WIP, use username = "username" and password = "password"'
          });
          });
        }
      finally {
        await client.close();
      }
    }
));

passport.serializeUser(function(user, done) {
  // TODO: Use database and return user ID
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({ message: 'Logged in successfully', user: req.user });
});



//Server calls for different functions
app.get("/recogs", (req, res) => {
  if (!req.isAuthenticated()){
    res.status(401).send({ message: 'You are not logged in' });    
  }
  else{
    getRecogs(req, res);
  }
});

async function getRecogs(req, res) {
const client = new MongoClient(URI);
var allRecogs;
  try {
    await client.connect();
    var dbo = client.db("Test-Database");
    console.log(req);
    dbo.collection("TestRecognitions").find({companyID: req.user.companyId}, function(err, result) {
      allRecogs = result;
    });
    var count = 0;
    recogsIndexed = {};
    await allRecogs.forEach(doc => indexRecogs(doc));
    function indexRecogs(doc){
      recogsIndexed[count] = doc;
      count++;
    }
    res.send(recogsIndexed);
  }
finally {
  await client.close();
}
}




// The call to app.listen(PORT, ...) is in server.js
module.exports = app
