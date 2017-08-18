const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

var port = process.env.PORT || 3000;

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
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.delete('/todos/:id', (req, res) => {
    
    //Validate Id using isValid
    var todoID = req.params.id;
    
    if(!ObjectId.isValid(todoID)){
        res.status(404).send({Message:'ID is not valid', Error: 404});
    }

    Todo.findByIdAndRemove(todoID).then((todo) => {
        
        if(!todo){
            res.status(404).send('Todo not found');
        }
    
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.patch('/todos/:id', (req, res) => {
    
    //Validate Id using isValid
    var todoID = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);
    
    if(!ObjectId.isValid(todoID)){
        res.status(404).send({Message:'ID is not valid', Error: 404});
    }

    if(_.isBoolean(body.completed) && body.completed) {
        console.log("Updating first");
        body.completedAt = new Date().getTime();
    } else {
        console.log("Updating next");
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(todoID, {$set: body}, {new: true}).then((todo) => {
        
        if(!todo){
            res.status(404).send('Todo not updated');
        }
    
        res.send({todo});
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

module.exports = {app};