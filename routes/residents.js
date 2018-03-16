'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const passport = require('passport');
const mongoose = require('mongoose');
const {User, Resident} = require('../models/users');
const Unit = require('../models/units');
const Lease = require('../models/leases');
const permit = require("../permissions");
const jwtAuth = passport.authenticate('jwt', {session: false});


router.get('/',jwtAuth, permit('Owner'), (req, res)=>{
    Resident.find()
    .populate('leases')
    .exec()
    .then(residents => {
        res
            .status(200)
            .json(residents);
    });
});

router.get('/:id', jsonParser, jwtAuth, permit('Owner'), (req, res) =>{
    Resident
    .findById(req.params.id)
    .populate('leases')
    .exec()
    .then(resident => {
        res
            .status(200)
            .json(resident);
    });
});

router.post('/', jsonParser, jwtAuth, permit('Owner'), (req, res) =>{
    
    const requiredFields = ['username', 'password','firstName','lastName',
    'emailAddress'];
    const missingField = requiredFields.find(field => !(field in req.body));
    
    if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
    }
    
    const stringFields = ['username', 'password', 'firstName', 'lastName',
     'emailAddress'];
    const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
    }
    
    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
    );

    if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
    }
    
    const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 7,
      max: 72
    }
    };
    const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
    );
    const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
    );

    if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
    }
    
    let {firstName, lastName, emailAddress, 
    dateOfBirth, phoneNumber, password,notes,username} = req.body;
 
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User
    .find({username})
    .count()
    .then(count => {
      if (count > 0) {
          return Promise.reject({
           code: 422,
           reason: 'ValidationError',
           message: 'username already taken',
           location: 'username'
           });
      }
    })
    .then(() => {
          return User
              .find({emailAddress})
              .count();
        }
    )
      .then(count => {
        if (count > 0) {
          return Promise.reject({
            code: 422,
            reason: 'ValidationError',
            message: 'Email already taken. If this is your account, please log in',
            location: 'emailAddress'
          });
        }
        return User.hashPassword(password);
      })
    .then( hash => {
          return User.create({
            username,
            password: hash,
            emailAddress,
            firstName,
            role: 'Resident',
            lastName,
            dateOfBirth,
            phoneNumber,
            notes
          });
        }
    )
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      console.log(err);
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

router.post('/:resident_id/lease', jsonParser,jwtAuth,permit('Owner'), (req, res) => {
  //skip validation
  const { unitNumber, leaseStartDate, leaseEndDate, monthlyRent, securityDeposits, petDeposit, unit_id} = req.body;
  Resident
      .findById(req.params.resident_id)
      .then(resident => {
        return Lease
            .create({
              unitNumber,
              leaseStartDate,
              leaseEndDate,
              monthlyRent,
              securityDeposits,
              petDeposit,
              unit: unit_id,
              resident: resident._id
            })
            .then(lease => {
              resident.leases.push(lease);
              return resident.save();
            });
      })
      .then(resident => {
        res
            .status(201)
            .json(resident);
      });
});

module.exports = router;

