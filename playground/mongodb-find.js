//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

var obj = new ObjectID();

console.log( obj );

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err){
        return console.log('Error connecting to database');
    }
    console.log('Connected to db server');

    // db.collection('Todos').find({
    //     _id: new ObjectID('5990e6926ad1890cac30808b')
    //     }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({name:'Owen Thomas'}).count().then((count) => {
        console.log(`Todos Count : ${count}`);
    }, (err) => {
        console.log('Unable to fetch todos', err);
    });


    //db.close();
});