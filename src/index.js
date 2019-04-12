var express = require('express');
var router = express.Router();
var logger = require('./logger');


router.get('/', function(req, res) {
  logger.request.info('url:'+ decodeURI(req.url));
  res.send(200);
});

