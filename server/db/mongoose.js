var mongoose = require('mongoose');
console.log("MONGODB_URI = ", process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
console.log("heroku env = ", env);
module.exports = {mongoose};

