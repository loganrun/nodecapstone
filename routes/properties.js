'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const Property = require('../models/properties');
const Unit = require('../models/units');
const passport = require('passport');
const permit = require("../permissions");
const jwtAuth = passport.authenticate('jwt', {session: false});


router.get('/',jsonParser,jwtAuth, permit('Owner'), (req, res) => {
  Property
      .find({user:req.user._id})
      .populate('units')
      .exec()
      .then(properties => {
        res
            .status(200)
            .json(properties);
      });
});


router.post('/', jsonParser, jwtAuth,permit('Owner'), (req, res) => {
  const requiredFields = ['name', 'street','city','state','zipcode'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
    }
  
  const stringFields = ['name', 'street', 'city', 'state','zipcode'];
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
  
  const { name, street,city, state, zipcode} = req.body;
  Property
      .create({
        name,
        address:{
          street: street,
          City: city,
          State: state,
          zipcode: zipcode
        },
        user: req.user._id
      })
      .then(property => {
        res
            .status(201)
            .json(property);
      });
});

router.post('/:property_id/unit', jsonParser,jwtAuth,permit('Owner'), (req, res) => {
  //skip validation
  const { area, bedroom, bathroom, garage, notes, unitNumber} = req.body;
  Property
      .findById(req.params.property_id)
      .then(property => {
        return Unit
            .create({
              unitNumber,
              area,
              bedroom,
              bathroom,
              garage,
              notes,
              property: property._id
            })
            .then(unit => {
              property.units.push(unit);
             return property.save().then(()=>{
               res.status(201)
              .json(unit);
             });
            });
      });
      
});

router.delete('/:property_id', jsonParser, jwtAuth,permit('Owner'), (req, res) => {
  Property.findByIdAndRemove(req.params.property_id)
      .then(property => {
        res
            .status(201)
            .json(property);
      });
});

router.delete('/:property_id/:units_id', jsonParser, jwtAuth,permit('Owner'), (req, res) => {
  console.log(req.params);
  Property.findById(req.params.property_id).populate('units')
      .then(property => {
        let removeUnits=property.units.findIndex(item => {
          return item._id == req.params.units_id;
        });
        property.units.splice(removeUnits, 1);
        return property.save();
      })
      .then(property => {
        res
            .status(201)
            .json(property);
      });
      
});


module.exports = router;