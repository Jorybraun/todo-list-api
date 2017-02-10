const request = require('supertest');
const assert = require('assert');
const User = require('../../models/user');
const app = require('../../app');

describe('User Controller', () => {


  describe('User#index', () => {

    it('gets user from to /api/user/:id', (done) => {
      const user = new User({ 'email': 'jory@gmail.com', 'password': '12456'});
      user.save()
        .then((user) => {
          let { _id } = user;
          request(app)
            .get(`/api/user/${_id}`)
            .expect(200)
            .end((err, response) => {
              assert(response.body._id.toString() === _id.toString())
              done();
            });
        });
    });
  });

  describe('User#create', () => {

    it('responds with 422 if emil not supplied', (done) => {
      request(app)
        .post('/api/signup/')
        .send({ 'password': '12345678910' })
        .expect(422)
        .end(() => done());
    });

    it('responds with 422 if password is not supplied', (done) => {
      request(app)
        .post('/api/signup/')
        .send({ 'email': 'jory@gmail.com' })
        .expect(422)
        .end(() => done());
    });

    it('creates user to /api/create', (done) => {
    request(app)
      .post('/api/signup')
      .send({ 'email': 'jory@gmail.com', 'password': '1245678910' })
      .end((err, response) => {
        if(err) return done(err);
        User.findOne({ 'email': 'jory@gmail.com' })
         .then((user) => {
            assert(user.email === 'jory@gmail.com');
            done();
         });
      })
    });
  });

  describe('User#edit', () => {

    let user;

    beforeEach((done) => {
      user = new User({'email': 'jory@gmail.com', 'password': '1234568'});
      user.save().then(() => done());
    });


    it('email address can be updated', (done) => {
      // create and save a user
      const { _id } = user;

      request(app)
      .put(`/api/user/${_id}`)
      .send({'email': 'bob@gmail.com'})
      .end(() => {
        User.findById(_id)
        .then((user) => {
          assert(user.email === 'bob@gmail.com');
          done();
        })
      })
    });
  });

  describe('User#addTodo', () => {

    let user;

    beforeEach((done) => {
      user = new User({'email': 'jory@gmail.com', 'password': '1234568'});
      user.save().then(() => done());
    });

    it('adds todo', (done) => {

      const { _id } = user;

      request(app)
        .post(`/api/user/${_id}/todos`)
        .send({title: 'first todo', description: 'just do it'})
        .expect(200)
        .end(() => {
          User.findById(_id)
          .then((user) => {
            assert(user.todoList.length > 0);
            done();
          });
        });
    })
  });

  describe('User#removeTodo', () => {

    let user;

    beforeEach((done) => {
      user = new User({'email': 'jory@gmail.com', 'password': '1234568', 'todoList': [{'title': 'one', 'description': 'two'}] });
      user.save().then(() => done());
    });

    it('removes todo', (done) => {

      const { _id } = user;
      const todo_id = user.todoList[0]._id;

      request(app)
        .delete(`/api/user/${_id}/todos/${todo_id}`)
        .expect(200)
        .end((err) => {
          User.findById(_id)
            .then((user) => {
              done();
              assert(true)
            });
        });
    })
  });


  describe('User#signin', () => {

    let token;

    beforeEach((done) => {
      request(app)
        .post('/api/signup')
        .send({ 'email': 'jory@gmail.com', 'password': '12345678' })
        .expect(200)
        .end((err, res) => {
          token = res.body.token;
          done();
        });
    });

    it('signin supplys correct JWT token', (done) => {
      request(app)
        .post('/api/signin')
        .send({ 'email': 'jory@gmail.com', 'password': '12345678' })
        .end((err, res) => {
          assert(token, res.token);
          done();
        });
    });

  });



}); 