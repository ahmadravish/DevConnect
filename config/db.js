const mongoose = require('mongoose');

const config = require('config');
const db = config.get('mongoURI'); //take value from json file

//use to connect to database from link in URI taken from mongoDb atlas
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true, //to remove terminal warnings
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDb connected..');
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
