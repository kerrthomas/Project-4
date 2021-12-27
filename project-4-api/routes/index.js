var express = require('express');
var router = express.Router();
var yahoo = require('yahoo-stock-prices');
const chart = require('chart.js');
const db = require('../lib/database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  mysql.conn.connect;
});

module.exports = router;