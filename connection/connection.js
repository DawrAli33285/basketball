const mongoose = require('mongoose');

// MongoDB Atlas connection string
const uri = 'mongodb+srv://lemightyeagle:lemightyeagle@cluster0.7b9t5dx.mongodb.net/test?retryWrites=true&w=majority';

// Connection options to pass to mongoose.connect
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true, // optional, but recommended
  useFindAndModify: false // optional, if you are using findOneAndUpdate or findOneAndDelete etc.
};

// Connect to MongoDB Atlas
mongoose.connect(uri, options)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

module.exports = mongoose.connection;
