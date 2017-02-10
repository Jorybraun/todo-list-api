const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  title: String,
  details: String
});

module.exports = TodoSchema;