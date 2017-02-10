const app = require('../app');
const UserController = require('../controllers/user_controller');
const passportService = require('../services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = (app) => {
  // signup
  app.post('/api/signup/', UserController.create);

  // signin
  app.post('/api/signin/', requireSignin, UserController.signin);

  // User Routes
  app.get('/api/user/:id', requireAuth, UserController.index);
  
  app.put('/api/user/:id', requireAuth, UserController.edit);
  // TodoList Routes
  app.post('/api/user/:id/todos', requireAuth, UserController.addTodo);
  app.delete('/api/user/:id/todos/:todo_id', requireAuth, UserController.removeTodo);

}

