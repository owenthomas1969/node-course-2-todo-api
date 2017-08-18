const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
    
//     console.log(result);
// })

Todo.findByIdAndRemove('59962c990ab59b02f84fd821').then((todo) => {
    console.log(todo);
});

Todo.findOneAndRemove({ text: "Second todo"}).then((todo) => {
    console.log(todo);
});