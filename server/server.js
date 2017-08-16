var express = require('express');
var bodyParser = require('body-parser');

var {ObjectId} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
        text:req.body.text
    });

    todo.save().then(( doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
})

// GET /todos/:id fetch todo by id
app.get('/todos/:id', (req, res) => {

    //Validate Id using isValid
    var todoID = req.params.id;
    
    if(!ObjectId.isValid(todoID)){
        res.status(404).send({Message:'ID is not valid', Error: 404});
    }

    Todo.findById(todoID).then((todo) => {
        
        if(!todo){
            res.status(404).send('Todo not found');
        }
    
        res.send({todo});
    }, (e) => {
        res.status(400).send(e);
    });
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = {app};