const mongoose = require('mongoose');


mongoose.Promise = global.Promise;

let db;

before(done => {
  mongoose.connect('mongodb://localhost/test_api');
  mongoose.connection
    .once('open', () => done())
    .on('error', (error) => console.warn(error));
  
// drop the collections before each test
})

beforeEach((done) => {

  const { users } = mongoose.connection.collections;

  users.drop()
    .then(() => done())
    .catch(() => done());
});