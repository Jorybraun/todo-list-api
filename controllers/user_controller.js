const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');

// export the function for the authentication controller

const tokenForUser = function (user){
  const timeStamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timeStamp }, config.secret);
}


module.exports = {

  index(req, res){
    User.findById(req.params.id).then((user) => res.status(200).send(user));    
  },

  signin(req, res, next) {
    // user has allready been authenticated we just need to supply a token
    return res.send({ 'token': tokenForUser(req.body) });
    //res.status(200).send({ 'token': tokenForUser(req.user)});
  },

  create(req, res){
    // creates a new user
    if(!req.body.password || !req.body.email) {
      return res.status(422).send({error: 'you must provide name and password'});
    }

    const { email, password } = req.body;

    // check if the user allready exists
    User.findOne({'email': email}, (err, existingUser) => {

      if(existingUser) { 
        return res.status(422).send({error: 'Email address is allready in use'}) 
      }

      // if not create a new user object
      const user = new User({ email, password });

      user.save((err) => {
        if (err) { return next(err); }
        // respond with json token instead of user
        res.status(200).send({
          "token": tokenForUser(user)
        });
      });
    });
  },
  // edit a users profile
  edit(req, res){
    const _id = req.params.id;
    const payload = req.body;

    User.findByIdAndUpdate(_id, payload)
      .then(() => User.findById(_id))
      .then((user) => {
        res.status(200).send(user);
      })
  },

  addTodo(req, res){
    const _id  = req.params.id;
    const  todo  = req.body;
    // find the user  
    User.findById(_id, (err, user) => {
      // call add todoMethod on the user instance
      user.addTodo(todo)

      user.save((err) => {
        if(err) { return next(err); }
        res.status(200).send(user);
      })
    });
  },

  removeTodo(req, res){
    const { id, todo_id } = req.params;

    User.findById(id, (err, user) => {
        user.removeTodo(todo_id)
        user.save((err) => {
          if(err) { return next(err); }
          res.status(200).send(user);
        })
    });
    
  },

  // editTodo(req, res){
  //   const { id, todo_id } = req.params;

  //   User.findById(id, (err, user) => {
  //     user.editTodo(todo_id)
  //     user.save((err) => {
  //       if(err) { return next(err); }
  //       res.status(200).send(user);
  //     })
  //   });
  // }

}


// create controller for the user