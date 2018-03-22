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
  //skipping validation
  const { name, address} = req.body;

  Property
      .create({
        name,
        address,
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
              return property.save();
            });
      })
      .then(property => {
        res
            .status(201)
            .json(property);
      });
});


module.exports = router;