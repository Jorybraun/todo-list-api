const assert = require('assert');
const User = require('../../models/user');


describe('Todolist', () =>{

  function createUser(email, password, todoList) {
    return new User({ email, password, todoList }).save()
  };

  describe('#addTodo', () => {

    it('can add a todo to the list of an existing user', (done) => {

      createUser('jory@gmail.com', '******', [])
      // find the existing user 
      .then(User.findOne({ 'email': 'jory@gmail.com' }) )
      .then((bob) => {
          bob.addTodo({
            'title': 'make test fail',
            'details': 'then make the test pass'
          });
          return bob.save()
      })
      .then(() => User.findOne({'email': 'jory@gmail.com'}))
      .then((bob) => {
        assert(bob.todoList.length > 0);
        done();
      });
    });
  });

  describe('removeTodo', () => {

    it('user can remove todo', (done) => {

      createUser('jory@gmail.com', '******', [{'title': 'one', 'description': 'two'}])
      .then(() => User.findOne({'email': 'jory@gmail.com'}))
      .then((bob) => {
        const { _id } = bob.todoList[0];
        bob.removeTodo(_id);
        return bob.save()
      })
      .then(() => User.findOne({'email': 'jory@gmail.com'}))
      .then((bob) => {
        assert(bob.todoList.length === 0)
        done();
      })
    });
  });

});