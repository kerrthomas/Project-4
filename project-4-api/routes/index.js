import db from '../database';
var express = require('express');
var router = express.Router();

/* GET home page. */
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

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;