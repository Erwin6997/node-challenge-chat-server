const express = require("express")
const app = express();
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


const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};



//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];



//new
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages" , (req, res) =>{
  console.log(messages);
  if(!messages) {
    res.sendStatus(404);
  }else {
  res.send(messages);
  }

})

app.post("/messages/add" , (req, res) =>{
let collection = db.collection("messages");
  console.log(req.body);
  console.log("body");
  messages.push(req.body);

  collection.insertOne(req.body, function (error, result ){
    if (error){
      console.log(error);
      res.status(500).send(error);
    } else {
      res.status(200).send(result.ops[0])
    }
  })
})

app.delete("/messages/:id", (req,res)=> {
  const delMess = { "id" : request.params.id };
  console.log(delMess);
  let collection = db.collection("messages");
  collection.deleteOne(delMess , function (error, result ){
    if (error){
      console.log(error);
      res.status(500).send(error);
    } else {
      res.status(200).send(result.ops[0])
    }
  })
})

app.get("/search?", (req, res)=> {
  const searchTerm = req.query.term
  const searchedMess = messages.find(mess => mess.from.toLowerCase().includes(searchTerm.toLowerCase()) || mess.text.toLowerCase().includes(searchTerm.toLowerCase()))
    !searchedMess? res.sendStatus(404) : res.send(searchedMess)
})

app.put("/update/:id", (req, res)=> {
  const reqId = Number(req.params.id)
  
  let message = messages.find(mess => mess.id === reqId)
  const index = messages.indexOf(message)
 
  if(message) {
    let messUpdate = {
      id: message.id,
      from: req.body.from,
      text: req.body.text,
      timeSent: message.timeSent
    }
    messages.splice(index, 1, messUpdate)
    res.json(message)
  } else {
    res.sendStatus(400)
  }

})