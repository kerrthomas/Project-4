var express = require('express');
var router = express.Router();
var yahoo = require('yahoo-stock-prices');
const chart = require('chart.js');
const canvas = require('canvas');
const mysql = require('../lib/database');
const canvasItem = require('../canvas.js');
const moment = require('moment');
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("Connected to the API route!");
});

router.get('/portfolio/:portfolioid', async (req, res) => {
  console.log("Trying to retrieve from database...")
  mysql.db.getConnection((error, connection) => {
    connection.query("SELECT * FROM portfolio WHERE portfolioid = ?", [req.params.portfolioid], async (err, results) => {
      if (err) throw err;
      if (results) {
        res.send({ results });
      }
      else {
        console.log("Error getting portfolio");
      }
    });
    mysql.db.releaseConnection(connection);
  })
});

router.get('/user/:userid', async (req, res) => {
  console.log("Trying to retrieve from database...")
  mysql.db.getConnection((error, connection) => {
    connection.query("SELECT * FROM users WHERE userid = ?", [req.params.userid], async (err, results) => {
      if (err) throw err;
      if (results) {
        res.send({ results });
      }
      else {
        console.log("Error getting portfolio");
      }
    });
    mysql.db.releaseConnection(connection);
  })
});

router.get('/transactions/:logid', async (req, res) => {
  console.log("Trying to retrieve from database...")
  mysql.db.getConnection((error, connection) => {
    connection.query("SELECT * FROM transactionlogs WHERE logid = ?", [req.params.logid], async (err, results) => {
      if (err) throw err;
      if (results) {
        res.send({ results });
      }
      else {
        console.log("Error getting portfolio");
      }
    });
    mysql.db.releaseConnection(connection);
  })
});

router.post('/login', async (req, res) => {
  mysql.db.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT * FROM users WHERE username = ?", [req.body.username], async (error, results) => {
      if (error) throw error;
      if (results.length > 0) {
        let checkPassword = await bcrypt.compare(req.body.password.toString(), results[0].password.toString())
        if (checkPassword) {
          console.log("Login successful!");
          res.json({ results, success: "Login successful!" });
        }
        else {
          res.json({ error: "Invalid Username or Password." });
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
    connection.query("SELECT * FROM users WHERE username = ?", [req.body.username], async (error, results) => {
      if (results.length > 0) {
        res.json({ error: "Username is already taken!" });
      }
      else {
        let cipher = bcrypt.hashSync(req.body.password, 10);
        connection.query("INSERT INTO users(username, password) VALUES(?, ?)", [req.body.username, cipher], async (error, results) => {
          if (error) throw error;
          console.log(results);
          if (results) {
            console.log("Registry successful!");
            connection.query("UPDATE users SET portfolioid = LAST_INSERT_ID(), logid = LAST_INSERT_ID() WHERE userid = LAST_INSERT_ID()", async (error, results) => {
              if (error) throw error;
              console.log(results);
              if (results) {
                res.json({ success: "Registry successful!" });
                console.log(cipher);
              }
              else {
                res.json({ error: "There was an error" });
              }
            })
          }
        });
        mysql.db.releaseConnection(connection);
      };
    })
  })
});

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
    if (item.open != null)
      newData.push(item)
  })
  let newDates = [];
  newData.forEach((item) => {
    let noFormat = new Date(item.date * 1000);
    let formatDate = moment(noFormat);
    formatDate.format("MM Do YYYY");
    newDates.push(formatDate);
  })
  newData.reverse();
  newDates.reverse();
  let myChart = new chart.Chart(ctx, {
    type: 'line',
    data: {
      labels: newDates.map(item => item),
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

router.put('/portfolio', async (req, res) => {
  console.log(req.body.portfoliodata);
  let portfolio = req.body.portfoliodata;
  mysql.db.getConnection((error, connection) => {
    connection.query("UPDATE portfolio SET portfoliodata = ? WHERE portfolioid = ?", [JSON.stringify(portfolio), req.body.userid], async (err, results) => {
      if (err) throw err;
      if (results.affectedRows > 0) {
        console.log("Porfolio saved!");
        res.send({ results });
      }
      else
        res.send({ error: "There was an error." })
    })
    mysql.db.releaseConnection(connection);
  })
});

router.put('/transactions', async (req, res) => {
  let transactions = req.body.log;
  mysql.db.getConnection((error, connection) => {
    console.log(req.body)
    connection.query("UPDATE transactionlogs SET log = ? WHERE logid = ?", [JSON.stringify(transactions), req.body.userid], async (err, results) => {
      console.log(results);
      if (err) throw err;
      if (results) {
        console.log("Transactions successfully logged!");
        res.send({ results });
      }
    });
    mysql.db.releaseConnection(connection);
  })
});

router.put('/balance', async (req, res) => {
  mysql.db.getConnection((error, connection) => {
    console.log(req.body)
    connection.query("UPDATE users SET balance = ? WHERE userid = ?", [req.body.balance, req.body.userid], async (err, results) => {
      console.log(results);
      if (err) throw err;
      if (results) {
        console.log("Balance updated!");
        res.send({ results });
      }
    });
    mysql.db.releaseConnection(connection);
  })
});

module.exports = router;