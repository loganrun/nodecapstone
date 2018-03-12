'use Strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.Promise = global.Promise;

const options = {
    discriminatorKey:   'role'
};

const UserSchema = mongoose.Schema({
    username: {
        type:   String,
        required:   true,
        unique: true
    },
   
    
    password:{
        type:    String,
        required:   true,
    },
    firstName:{
        type:  String,
        default:    ''
    },
    lastName:{
        type: String,
        default: ''
    },
    emailAddress: {type: String, required: true},
    
    //role:   {type: String, required:true}
    
    
}, options);


UserSchema.methods.serialize = function(){
    return {
        username:   this.username || '',
        firstName:  this.firstName || '',
        lastName:   this.lastName || '',
    
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

const Owner = User.discriminator('Owner', mongoose.Schema({
     _id: mongoose.Schema.Types.ObjectId,
    properties: [{type: mongoose.Schema.Types.ObjectId, ref: 'property'}]
}, options));

const Resident = User.discriminator('Resident', mongoose.Schema({
    dateOfBirth:  {type: String, required: true},
    phoneNumber: {type: String},
    notes:   {type: String,  default: ''}, 
    leases: [{type: mongoose.Schema.Types.ObjectId, ref: 'lease'}]
}, options));

module.exports = {User, Resident, Owner};


