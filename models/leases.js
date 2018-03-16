const mongoose = require('mongoose');


const leaseSchema = mongoose.Schema({

  unitNumber:   {type: String, required:  true},
  leaseStartDate: {type:  String, required: true},
  leaseEndDate: {type: String, required: true},
  monthlyRent:  {type: String, required: true},
  securityDeposit: {type: String, reuired: true},
  petDeposit:   {type: String,  required: true},
  unit: {type: mongoose.Schema.Types.ObjectId, ref: 'unit'},
  resident: {type: mongoose.Schema.Types.ObjectId, ref: 'resident'}
});

    
const Lease = mongoose.model('lease', leaseSchema);

module.exports = Lease;