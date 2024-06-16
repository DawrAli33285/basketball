const mongoose = require('mongoose');
// lemightyeagle

let connection = mongoose.connect('mongodb+srv://lemightyeagle:lemightyeagle@cluster0.7b9t5dx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

module.exports = connection;
