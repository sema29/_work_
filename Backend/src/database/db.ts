const mongoose = require("mongoose");

mongoose.set("strictQuery", true);


mongoose.connect("mongodb+srv://semanurboz5:169978@work.ge9ke23.mongodb.net/work", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, " DB Error"));
db.once("open", function () {
  console.log("Connection OK");
});
