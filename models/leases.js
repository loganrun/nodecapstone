const mongoose = require('mongoose');


const leaseSchema = mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,
  unitNo:   {type: String, required:  true},
  leaseStartDate: {type:  String, required: true},
  leaseEndDate: {type: String, required: true},
  monthlyRent:  {type: String, required: true},
  securityDeposit: {type: String, reuired: true},
  petDeposit:   {type: String,  required: true},
  units: [{type: mongoose.Schema.Types.ObjectId, ref: 'unit'}],
  residents: [{type: mongoose.Schema.Types.ObjectId, ref: 'resident'}]
});

    
const Lease = mongoose.model('lease', leaseSchema);

module.exports = Lease;