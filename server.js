var express = require('express');
var app = express();
var mongoose = require('mongoose');

// pull correct settings per environment
var config = require('./app/config/config.js')
var environmentSettings = config.config();

// connect to DB which is on port 27017
mongoose.connect(environmentSettings.db);

// listen to port as defined or default 3000
var port = process.env.PORT || 3000;

app.get('/', function(request, response) {
  response.json({message: 'this is json'});
});

app.listen(port);

console.log('Server is running on port', port);