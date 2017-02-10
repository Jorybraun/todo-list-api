const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todoSchema = require('./todo');
const bcrypt = require('bcrypt-nodejs');
// Regex to test email
const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: (email) => re.test(email),
      message: 'Email must be a valid email'
    }
  },
  password: {
    type: String,
    required: true
  },  
  todoList: [todoSchema]
});

// #addTodo method
UserSchema.methods.addTodo = function(todo){
  this.todoList = [todo,  ...this.todoList];
}

// #removeTodo
UserSchema.methods.removeTodo = function(Id){
  this.todoList = [...this.todoList.filter((todo) => todo._id.toString() !== Id.toString())];
}

// UserSchema.methods.editTodo = function(Id, todo){
//   let temp = this.todoList;
//   Object.assign(temp.find((todo) => todo._id.toString() === Id.toString()), todo);
// }
UserSchema.methods.comparePassword = function(candidatePassword, cb){
  bcrypt.compare(candidatePassword.toString(), this.password.toString(), function(err, isMatch)  {
    if(err) {return cb(err)}

    cb(null, isMatch);
  }); 
}

// on save hook encrypt password
UserSchema.pre('save', function(next) {
  const user = this;
  // generate salt then run call back
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }
    // hash the salty password
    bcrypt.hash(user.password.toString(), salt, null, function(err, hash) {
      // overwrite the password
      user.password = hash;
      next();
    });

  });
});

// add schema to model 
const User = mongoose.model('User', UserSchema);


// export collection
module.exports = User;