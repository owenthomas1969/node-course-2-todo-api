var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DEV_MONGODB || 'mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};