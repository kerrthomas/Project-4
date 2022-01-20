var express = require('express');
var router = express.Router();
var yahoo = require('yahoo-stock-prices');
const chart = require('chart.js');
const canvas = require('canvas');
const mysql = require('../lib/database');
const canvasItem = require('../canvas.js');
const moment = require('moment');
const CryptoJS = require("crypto-js");
var key = "ASECRET";

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("Connected to the API route!");
});

router.get('/test', async (req, res) => {
  console.log("Trying to retrieve from database...")
  mysql.db.getConnection((error, connection) => {
    connection.query("SELECT * FROM portfolio", async (err, results) => {
      if (err) throw err;
      if (results) {
        console.log("Query successful!");
      }
    });
    mysql.db.releaseConnection(connection);
  })
});

router.post('/login', async (req, res) => {
  mysql.db.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT * FROM user WHERE username = ?", [req.body.username], async (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        if(CryptoJS.AES.decrypt(results[0].password, key) == req.body.password) {
          console.log("Login successful!");
          res.send({ results });
        }
      } else {
        res.json({ error: "Invalid Username or Password." });
      }
    });
    mysql.db.releaseConnection(connection);
  })
});

router.post('/register', async (req, res) => {
  mysql.db.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT * FROM user WHERE username = ?", [req.body.username], async (error, results) => {
      if (results.length > 0) {
        res.json({ error: "Username is already taken!" });
      } else {
        let cipher = CryptoJS.AES.encrypt(req.body.password, key);
        connection.query("INSERT INTO user(username, password) VALUES(?, ?)", [req.body.username, cipher], async (error, results) => {
          if (error) throw error;
          console.log(results);
          if (results) {
            console.log("Registry successful!");
            res.json({ success: "Registry successful!" });
            console.log(cipher);
          } else {
            res.json({ error: "There was an error" });
          }
        })
      }
    });
    mysql.db.releaseConnection(connection);
  })
})

router.get('/yahoo/:stock', async (req, res) => {
  try {
    let api = await yahoo.getCurrentData(req.params.stock);
    console.log(api);
    res.send({ api });
  } catch (error) {
    res.send({ error })
  }
});

router.get('/chart/:stock', async (req, res) => {
  let chartData = await yahoo.getHistoricalPrices(1, 1, 2021, 12, 31, 2021, req.params.stock, '1mo');
  console.log(chartData);
  let ctx = canvasItem.canvasItem;
  let newData = [];
  chartData.map((item) => {
    if(item.open != null)
      newData.push(item)
  })
  let myChart = new chart.Chart(ctx, {
    type: 'line',
    data: {
      labels: newData.map(item => item.date),
      datasets: [{
        label: [req.params.stock],
        data: newData.map(item => item.open),
        backgroundColor: [
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)'
        ],
        borderColor: [
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)',
          'rgba(34, 111, 199, 0.828)'
        ],
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  let sendChart = new canvas.Image();
  sendChart = ctx.toDataURL();
  res.send({ sendChart });
  myChart.destroy();
});

router.post('/transactions'), async (req, res) => {
  mysql.db.getConnection((error, connection) => {
    connection.query("SELECT * FROM transactionlog WHERE userid = ?", [req.body.userid], async (error, results) => {
      connection.query("UPDATE transactionlog SET logs = ?", [req.body.logs], async (err, results) => {
          if (err) throw err;
          if (results) {
            console.log("Transaction successfully logged!");
            res.send({ results });
          }
        })
      });
      mysql.db.releaseConnection(connection);
    })
}
module.exports = router;