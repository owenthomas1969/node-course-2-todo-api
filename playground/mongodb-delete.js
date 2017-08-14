//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log( obj );

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Error connecting to database');
    }
    console.log('Connected to db server');

    // deleteMany
    // db.collection('Todos').deleteMany({
    //     text: 'Drink beer',
    //     completed: true
    // }).then((result) => {
    //     console.log(result);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({
    //     text: 'Drink beer'
    // }).then((result) => {
    //     console.log(result);
    // });

    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({
        text: 'Drink beer'
    }).then((result) => {
        console.log(result);
    });

    //db.close();
});