const mongoose = require('mongoose');

const unitSchema = mongoose.Schema({
  unitNumber: {type: Number, required: true, default: ''},
  area: {type: String, default: ''},
  bedroom: {type: Number, default: 1},
  bathroom: {type: Number, default: 1},
  garage: {type: String, default: ''},
  notes: {type: String, default: ''},
  property: {type: mongoose.Schema.Types.ObjectId, ref: 'property'}
});

const Unit = mongoose.model('unit', unitSchema);

module.exports = Unit;


