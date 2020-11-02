const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');
const Schema = mongoose.Schema;

const WordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  kana: {
    type: String,
    required: false,
  },
  definition: {
    type: String,
    required: true,
  },
  pitch: {
    type: Array,
    required: false,
  },
  audio: {
    type: String,
    required: false,
  },
});

WordSchema.plugin(aggregatePaginate);

const Word = mongoose.model('Word', WordSchema);
module.exports = Word;
