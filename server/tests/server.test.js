const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectId(),
    text: 'First test  todo',
    completed: true,
    completedAt: 123456
}, {
    _id: new ObjectId(),
    text: 'Second test todo',
    completed: false
}];


beforeEach((done) => {
    Todo.remove({}).then(() => {
       return Todo.insertMany(todos);
    }). then(() => done());
});

describe('POST /todos', () => {

    it('Should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res) =>{
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
         
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => done(e));
        });
    });

    it('Should not create todo with bad data', (done) => {
        var text = '';

        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }
         
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    });

});

describe('GET /todos', () => {
    it('Should get all todos', (done) => {
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
})

describe('GET /todos/id', () => {
    it('Should return a todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });


    it('Should return 404 if todo not found', (done) =>{
        request(app)
        .get('/todos/' + (new ObjectId()).toHexString())
        .expect(404)
        .end(done);

    })

    it('Should return 404 for non object ids', (done) => {
        //todos/123
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
        
    })
})

describe('DELETE /todos/id', () => {
    it('Should remove a todo', (done) => {

        var hexId = todos[0]._id.toHexString();

        request(app)
        .delete(`/todos/${hexId}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }

            Todo.findById(hexId).then((todo) => {
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it('Should return 404 if todo not found', (done) =>{
        request(app)
        .delete('/todos/' + (new ObjectId()).toHexString())
        .expect(404)
        .end(done);

    })

    it('Should return 404 for non object ids', (done) => {
        //todos/123
        request(app)
        .delete('/todos/123')
        .expect(404)
        .end(done);
        
    })


    describe('PATCH /todos/id', () => {
    
        it('Should update a todo', (done) => {
    
            var hexId = todos[0]._id.toHexString();
            var updatedText = "This is the updated text"
            // Todo.findByIdAndUpdate(todoID, {$set: body}, {new: true}).then((todo) => {


            request(app)
            .patch(`/todos/${hexId}`)
            .send({
                completed: true,
                text: updatedText
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(updatedText);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            }).end(done);

        });
    
        it('Should update another todo todo', (done) => {
            
                    var hexId = todos[1]._id.toHexString();
                    var updatedText = "This is the second updated text"
                    // Todo.findByIdAndUpdate(todoID, {$set: body}, {new: true}).then((todo) => {
        
        
                    request(app)
                    .patch(`/todos/${hexId}`)
                    .send({
                        completed: false,
                        text: updatedText
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.todo.text).toBe(updatedText);
                        expect(res.body.todo.completed).toBe(false);
                        expect(res.body.todo.completedAt).toNotExist();
                    }).end(done);
        
                });
        

        // it('Should return 404 if todo not found', (done) =>{
        //     request(app)
        //     .delete('/todos/' + (new ObjectId()).toHexString())
        //     .expect(404)
        //     .end(done);
    
        // })
    
        // it('Should return 404 for non object ids', (done) => {
        //     //todos/123
        //     request(app)
        //     .delete('/todos/123')
        //     .expect(404)
        //     .end(done);
            
        })

})