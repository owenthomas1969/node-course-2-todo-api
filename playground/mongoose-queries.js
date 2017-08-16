const {ObjectId} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '59938681efbb2117b4d73959';
var userID = '59921d2042e3eb25f06f4991';

// if(!ObjectId.isValid(id)){
//     console.log('ID is not valid');
// }

// // Todo.find({
// //     _id: id
// // }).then((todos) => {
// //     console.log('Todos', todos);
// // });

// Todo.findOne({
//     completed: false
// }).then((todo) => {
//     console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
    
//     if(!todo){
//         return console.log('Id not found');
//     }

//     console.log('Todo by ID', todo);
// }).catch((e) => console.log(e));

User.findById(userID).then((user) => {
    
    if(!user){
        return console.log('User not found');
    }

    console.log('User by ID', user);
}).catch((e) => console.log(e));
