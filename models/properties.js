const mongoose = require('mongoose');


const propertySchema = mongoose.Schema({

  name: {type: String, required: true},
  _id:  mongoose.Schema.Types.ObjectId,
  address: {
    street: String,
    City:   String,
    State:  String,
    zipcode: String
  },
  units: [{type: mongoose.Schema.Types.ObjectId, ref: 'unit'}]
});
    
const Property = mongoose.model('property', propertySchema);

module.exports = Property;
