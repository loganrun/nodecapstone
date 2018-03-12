const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const Property = require('../models/properties');
const Unit = require('../models/units');


router.get('/', (req, res) => {
  Property
      .find()
      .populate('units')
      .exec()
      .then(properties => {
        res
            .status(200)
            .json(properties);
      });
});


router.post('/', jsonParser, (req, res) => {
  //skipping validation
  const { name, address } = req.body;

  Property
      .create({
        name,
        address,
        _id: new mongoose.Types.ObjectId,
      })
      .then(property => {
        res
            .status(201)
            .json(property);
      });
});

router.post('/:property_id/unit', jsonParser, (req, res) => {
  //skip validation
  const { area, bedroom, bathroom, garage, notes } = req.body;
  Property
      .findById(req.params.property_id)
      .then(property => {
        return Unit
            .create({
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