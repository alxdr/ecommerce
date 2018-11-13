const mongoose = require("mongoose");

const uri = process.env.DB_LOCAL;

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
