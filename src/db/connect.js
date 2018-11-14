const mongoose = require("mongoose");

const uri = process.env.DB;

function connect() {
  return mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useFindAndModify: false
    }
  );
}

module.exports = connect;
