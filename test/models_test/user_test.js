const assert = require('assert');
const User = require('../../models/user');

describe('User Model', () => {
  
  let bob;

  beforeEach((done) =>{
    bob = new User({'email': 'bob@gmail.com', 'password': '123456789' });
    bob.save().then(() => done());
  });

  it('can be saved', (done) => {
    assert(!bob.isNew);
    done();
  });

  it('has an email', (done) => {
    assert(bob.email);
    done();
  });

  it('email is required', (done) => {
    const bilbo = new User({});
    const validationResult = bilbo.validateSync();
    const { message } = validationResult.errors.email;
    assert( message === "Email is required");
    done();
  });

  it('must be a valid email', (done) => {
    const bilbo = new User({ 'email': 'john', 'password': '12456789' });
    const validationResult = bilbo.validateSync();
    const { message } = validationResult.errors.email;
    assert( message === "Email must be a valid email");
    done();
  });

  it('password is required', (done) => {
    const bilbo = new User({'email': 'email@gmail.com'});
    const validationResult = bilbo.validateSync();
    const { message } = validationResult.errors.password;
    assert( message === "Path `password` is required.");
    done();
  });

  it('password is salted', (done) => {
    User.findOne({'email': 'bob@gmail.com'})
    .then((user) => {
      assert(user.password !== "123456789");
      done();
    });
  });

});