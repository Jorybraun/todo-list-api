const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect('mongodb://localhost/todo');
}

app.use(bodyParser.json());
routes(app);

app.use((err, req, res, next) => {
  //manually set error code
  res.status(422).send({ error: err.message });
});

module.exports = app;