const mongoose = require('mongoose');

const unitSchema = mongoose.Schema({
  unitNumber: {type: String, required: true, default: ''},
  _id:  mongoose.Schema.Types.ObjectId,
  area: {type: Number, default: 1},
  bedroom: {type: Number, default: 1},
  bathroom: {type: Number, default: 1},
  garage: {type: Number, default: 0},
  notes: {type: String, default: ''},
  property: {type: mongoose.Schema.Types.ObjectId, ref: 'property'}
});

const Unit = mongoose.model('unit', unitSchema);

module.exports = Unit;


