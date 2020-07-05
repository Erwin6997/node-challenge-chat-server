const express = require("express");
const cors = require("cors");
//const bodyParser = require("body-parser");
const app = express();

app.use(cors())
//app.use(body.json())

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};
app.use(express.json());
//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/messages" , function (req, res ) {
  res.send(messages);
})

app.post("/messages/add", (req, res) => {

  messages.push(req.body);
  console.log("ADD NEW message:", req.body);
  res.json({ Success: true });
});

app.delete("/messages/:id", (req,res)=> {
  const delMess = Number(req.params.id)
  console.log(delMess);
  messages = messages.filter(mess=>mess.id !== delMess)
  res.send(messages)
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

const port = process.env.PORT || 3000;
const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});