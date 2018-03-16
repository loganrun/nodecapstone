const mongoose = require('mongoose');


const propertySchema = mongoose.Schema({

  name: {type: String, required: true},
  address: {
    street: String,
    City:   String,
    State:  String,
    zipcode: String
  },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  units: [{type: mongoose.Schema.Types.ObjectId, ref: 'unit'}]
});
    
const Property = mongoose.model('property', propertySchema);

module.exports = Property;
