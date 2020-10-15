const router = require("express").Router();
const Message = require("../models/message.model");

//first page:
router.route("/").get((request, response) => {
  response.sendFile(__dirname + "/index.html");
});

// all the messages:
router.route("/messages").get((request, response) => {
  console.log(request.query);
  const query = {};
  Message.find(query)
    .sort({createdAt: -1,})
    .then((messages) => {response.json({ messages });})
    .catch((err) => response.send({ Error: err }));
});

//create new message :
router.route("/messages/add").post((request, response) => {
  const newMessage = new Message(request.body);
  newMessage
    .save()
    .then((message) => response.json({ message }))
    .catch((error) => response.json({ error }));
});
// delete message :
router.route("/messages/del/:id").post((request, response) => {
  Message.deleteOne(request.params.id)
  .then((message) => response.json({ message }))
  .catch((error) => response.json({ error }));
})
// show 
router.route("/messages/:id").post((request, response) => {
  Message.findById(request.params.id)
  .then((message) => response.json({ message }))
  .catch((error) => response.json({ error }));
})
//edit
router.route("/messages/edit/:id").post((request, response) => {
  const editMessage = (request.body);
  Message.findById(request.params.id)
  .then((message) => {response.json({ message })
  message = editMessage;
  message.save();
})
  .catch((error) => response.json({ error }));
})
module.exports = router;
