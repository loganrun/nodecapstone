'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User} = require('../models/users');


router.get('/', (req, res, next)=>{
    User
      .find()
      .exec()
      .then(users => {
        res
            .status(200)
            .json(users);
      });
});

router.post('/signup', jsonParser,(req, res, next)=>{
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
    
    const validEmail = req.body['emailAddress'];
    const result = validEmail.match(/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/gi);
       if(!result){
         return res.status(422).json({
       code: 422,
       reason: 'ValidationError',
       message: 'Please enter valid email address.',
       location: 'emailAddress'
       });
       }
    
    let {username, password, firstName = '', lastName = '', emailAddress} = req.body;
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
            role: 'Owner',
            lastName
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



module.exports = router;

    
