'use strict';
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {User, Owner} = require('../models/users');
const expressValidator = require('express-validator');

// router.use(expressValidator({
//     customValidators: {
//       isUsernameAvailable(username) {
//         return new Promise((resolve, reject) => {
//           User.findOne({ username: username }, (err, user) => {
//             if (err) throw err;
//             if(user == null) {
//               resolve();
//             } else {
//               reject();
//             }
//           });
//         });
//       }
//     }
//   })
// );

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
    
    let {username, password, firstName = '', lastName = '', emailAddress} = req.body;
  firstName = firstName.trim();
  lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
          return Promise.reject({
           code: 422,
           reason: 'ValidationError',
           message: 'username already taken',
           location: 'username'
           });
        // return res.status(422).json({
        //     code: 422,
        //   reason: 'ValidationError',
        //   message: 'Username already taken',
        //   location: 'username'
        // });
      }  
        })
      
    .then(
        User.find({emailAddress})
        .count()
        .then(count =>{
            if(count >0){
                return Promise.reject({
                 code: 422,
                   reason: 'ValidationError',
                   message: 'Email already taken. If this is your account, please log in',
                   location: 'emailAddress'
               });
            //   return res.status(422).json({
            //           code:    422,
            //           reason: 'ValidationError',
            //           message: 'Email already taken. If this is your account, please log in',
            //           location: 'emailAddress'
            //       });
            }
            //return User.hashPassword(password);
        })
    )
    .then(
       User.create({
        username,
        password,
        emailAddress,
        firstName,
        role:   'Owner',
        lastName
      })
    )
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});

// Never expose all your users like below in a prod application
// we're just doing this so we have a quick way to see
// if we're creating users. keep in mind, you can also
// verify this in the Mongo shell.
router.get('/', (req, res) => {
  return User.find()
    .then(users => res.json(users.map(user => user.serialize())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;

    
//     req.checkBody('username', 'Username already in use').isUsernameAvailable();
//     //const neverUsed = ['password','username', 'emailAddress'];
//   // let {username, password, firstName = '', lastName = '', emailAddress} = req.body;
//     // User.find({username})
//     // .count()
//     // .then(count =>{
//     //     if (count > 0){
//     //         return Promise.reject({
//     //           code: 422,
//     //           reason: 'ValidationError',
//     //           message: 'username already taken',
//     //           location: 'username'
//     //         });
            
//     //     }
//     // });
//     var errors = req.validationErrors(true);

//     if(errors) {

//         return res.json({
//             success: false,
//             errors: errors
//         });
        

//     }


//     const user = new User({
//         _id: new mongoose.Types.ObjectId(),
//         username:   req.body.username,
//         password:   req.body.password,
//         firstName:  req.body.firstName,
//         lastName:   req.body.lastName,
//         emailAddress: req.body.emailAddress,
//         role:       'Owner'
//     });
//     user.save().then(result =>{
//         console.log(result);
//     })
//     .catch(err =>{
//         console.log(err);
//     });
//     res.status(201).json({
//         message: 'new user created',
//         createdUser: user
//     });
// });






// router.get('/:id', (req, res, next)=>{
//     res.status(200).json({
//         message: 'get specific properties'
        
//     });
// });

// router.put('/:id', (req, res, next)=>{
//     res.status(200).json({
//         message: 'update property'
//     });
// });

// router.delete('/:id', (req, res, next)=>{
//     res.status(200).json({
//         message: 'remove property'
//     });
// });

//let {username, password, firstName = '', lastName = '', emailAddress} = req.body;
    //   firstName = firstName.trim();
    //   lastName = lastName.trim();
    //   return User.find({username})
    //   .count()
    //   .then(count => {
    //       if (count > 0) {
    //           return Promise.reject({
    //               code: 422,
    //               reason: 'ValidationError',
    //               message: 'username already taken',
    //               location: 'username'
    //           });
    //       }
    //   })
    //   .then(User.find({emailAddress})
    //   .count()
    //   .then(count =>{
    //       if (count > 0){
    //           return Promise.reject({
    //               code: 422,
    //               reason: 'ValidationError',
    //               message: 'email already taken. Please sign in',
    //               location: 'emailAddress'
    //           })
    //       }
    //   })
    //   .then