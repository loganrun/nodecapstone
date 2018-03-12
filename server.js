'use strict';
const express = require('express');
const mongoose = require('mongoose');
const morgan= require('morgan');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
const {PORT,IP, DATABASE_URL} = require('./config.js');
const app = express();
app.use(bodyParser.json());
app.use(morgan('common'));
app.use(express.static('public'));


const propertyRouter = require('./routes/properties');
const accountRouter = require('./routes/accounts');
const usersRouter = require('./routes/users');
const residentRouter = require('./routes/residents');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use('/properties', propertyRouter);
app.use('/account', accountRouter);
app.use('/users', usersRouter);
app.use('/residents', residentRouter);

app.use('*', function (req, res) {
  res.status(404).json({ message: 'Not Found' });
});

let server;

function runServer(databaseUrl, port = PORT) {
console.log("server call", databaseUrl);
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port,IP, () => {
        console.log(`Your app is listening ${port} ${IP}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
 }

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
