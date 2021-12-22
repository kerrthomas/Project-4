var express = require('express');
var router = express.Router();
var yahoo = require('yahoo-stock-prices');
const chart = require('chart.js');
const db = require('../database.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  mysql.conn.connect;
});

router.get('/test', async(req, res) => {
  console.log("Trying to retrieve from database...")
  db.connect();
  db.query("SELECT * FROM stockmanager", async(err, results) => {
    if (err) throw err;
    if(results) {
      console.log("Query successful!");
    }
  });
});

router.get('/api/search/:symbol', async (req, res) => {
  const error = "Data not found."
  try {
    const data = await yahoo.getCurrentData(req.params.symbol);
    res.send({ data });
  } catch (e) {
    console.log(e)
    res.send({ error });
  }
});

module.exports = router;