//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log( obj );

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Error connecting to database');
    }
    console.log('Connected to db server');

    db.collection('Todos').findOneAndUpdate({
        text: 'Eat lunch'
    }, {
       $set: {
           text: 'Drink Wine'
       } 
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    })

    //db.close();
});