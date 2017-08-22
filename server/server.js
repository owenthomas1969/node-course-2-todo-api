require('./config/config.js');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();

var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {

    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({
        _creator: req.user._id
    }).then((todos) => {
        res.send({ todos });
    }, (e) => {
        res.status(400).send(e);
    });
})

// GET /todos/:id fetch todo by id
app.get('/todos/:id', authenticate, (req, res) => {

    //Validate Id using isValid
    var todoID = req.params.id;

    if (!ObjectId.isValid(todoID)) {
        res.status(404).send({ Message: 'ID is not valid', Error: 404 });
    }

    Todo.findOne({
        _id: todoID,
        _creator: req.user._id
    }).then((todo) => {

        if (!todo) {
            res.status(404).send('Todo not found');
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.delete('/todos/:id', authenticate, (req, res) => {

    //Validate Id using isValid
    var todoID = req.params.id;

    if (!ObjectId.isValid(todoID)) {
        res.status(404).send({ Message: 'ID is not valid', Error: 404 });
    }

    Todo.findOneAndRemove({
        _id: todoID,
        _creator: req.user._id
    }).then((todo) => {

        if (!todo) {
            res.status(404).send('Todo not found');
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.patch('/todos/:id', authenticate, (req, res) => {

    //Validate Id using isValid
    var todoID = req.params.id;

    var body = _.pick(req.body, ['text', 'completed']);

    console.log(body);

    if (!ObjectId.isValid(todoID)) {
        res.status(404).send({ Message: 'ID is not valid', Error: 404 });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        console.log("Updating first");
        body.completedAt = new Date().getTime();
    } else {
        console.log("Updating next");
        body.completed = false;
        body.completedAt = null;
    }

    console.log("FindOne and Update");
    Todo.findOneAndUpdate({
        _id: todoID,
        _creator: req.user._id
    }, { $set: body }, { new: true }).then((todo) => {

        if (!todo) {
            res.status(404).send('Todo not updated');
        }

        res.send({ todo });
    }).catch((e) => {
        res.status(400).send(e);
    });
})

app.post('/users', (req, res) => {
    //console.log(req.body);

    var body = _.pick(req.body, ['email', 'password']);

    // console.log(body);

    var user = new User(body);

    user.save().then(() => {
        //console.log('generateAuthToken');
        return user.generateAuthToken();
    }).then((token) => {
        //console.log('Token = ', token);
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    });

});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

app.post('/users/login', (req, res) => {

    var body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password).then((user) => {
        //res.send(user);
        user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }), () => {
        res.status(400).send();
    }
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

