const express = require("express")
const app = express();
const mongodb = require('mongodb');
const cors = require("cors");
const MongoClient = require('mongodb').MongoClient;
const port = process.env.PORT || 3000;
require("dotenv").config()
app.use(express.json());

let db_uri = process.env.DB_URI;
if (!db_uri){
  console.log("No DB_URI!  Specify it as an environment variable DB_URI (e.g. in .env)")
  process.exit(1)
}

let db;

// Initialize connection once
MongoClient.connect(db_uri, function(err, client) {
  if(err) throw err;
  
  db = client.db("meisamchat");
  // Start the application after the database connection is ready
  app.listen(port || 3000, function() {
    console.log(`Running at \`http://localhost:${port}\`...`)
  })
});


// const welcomeMessage = {
//   id: 0,
//   from: "Bart",
//   text: "Welcome to CYF chat system!",
// };

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
//const messages = [welcomeMessage];

//new
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages" , (req, res) =>{
  let collection = db.collection("messages");
  const all = {}
  collection.find(all).toArray(function(error, result) {
    if(error){
      res.status(500).send(error);
        }else if (result) {
          res.status(200).send(result);
        } else {
          res.sendStatus(404)
        }
  });
});

app.post("/messages/add" , (req, res) =>{
let collection = db.collection("messages");
  console.log(req.body);
  //messages.push(req.body);

  collection.insertOne(req.body, function (error, result ){
    if(error){
      res.status(400).send(error);
      }else if (result){
          res.status(200).send(result.ops[0]);
      }else {
          res.sendStatus(404);
    }
  });
});

app.delete("/messages/:id", (req,res)=> {
  const delMess = { "id" : req.params.id };
  console.log(delMess);
  console.log("ID");
  let collection = db.collection("messages");
  collection.deleteOne(delMess , function (error, result ){
    if(error){
      res.status(400).send(error);
      console.log("Error", error);
        }else if (req.result) {
          res.status(204).send('Delete one film');
        } else {
          res.sendStatus(404)
        }
  })
})

app.get("/search?", (req, res)=> {
  let collection = db.collection("messages");
  if (mongodb.ObjectID.isValid(req.params.id)){
    res.status(404).send("The Id is not Valid!");
  }else{
    const searchObject = { "_id" : new mongodb.ObjectID(req.params.id) };
    console.log(searchObject);
    
    collection.find(searchObject).toArray(function(error, result) {
      console.log(result)
      console.log("xxx");
      if(error){
        res.status(500).send(error);
      }else if (result) {
        res.status(200).send(result);
      } else {
        res.sendStatus(404)
      }
    });
  }
})

app.put("/update/:id", (req, res)=> {
  const searchObject = { "_id" : req.params.id };
    console.log(searchObject);
    let collection = db.collection("messages");
    collection.find(searchObject).toArray(function(error, result) {
      res.send(error || result);
      const update = {
        $set: {
          text
        },
      };
    collection.findOneAndUpdate(searchObject , update ,function (error, result) {
      if(error){
        req.status(400).send(error);
          }else if (req.result) {
            req.sendStatus(204)
          } else {
            req.sendStatus(404)
          }
          res.send('Update one film');
      });
    });
});