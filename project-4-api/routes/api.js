var express = require('express');
var router = express.Router();
var yahoo = require('yahoo-stock-prices');
const chart = require('chart.js');
const mysql = require('../lib/database');

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log("Connected to the API route!");
});

router.get('/test', async (req, res) => {
  console.log("Trying to retrieve from database...")
  mysql.db.getConnection((error, connection) => {
    connection.query("SELECT * FROM stockmanager", async (err, results) => {
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
      console.log(results);
      if (results.length > 0) {
        console.log("Login successful!");
        res.send({ results });
      } else {
        res.json({ error: "Invalid Username or Password." });
      }
    });
    mysql.db.releaseConnection(connection);
  })
});

router.post('./register', async (req, res) => {
  mysql.db.getConnection((error, connection) => {
    if (error) throw error;
    connection.query("SELECT * FROM user WHERE username = ?", [req.body.username], async (error, results) => {
      if (results.length > 0) {
        res.json({ error: "Username is already taken!"});
      } else {
        connection.query("INSERT INTO user(username, password) VALUES(?, ?)", [req.body.username, req.body.password], async (error, results) => {
          if (error) throw error;
          console.log(results);
          if (results) {
            console.log("Registry successful!");
            res.json({ success: "Registry successful!" });
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

/*
let stockChart = new chart.Chart(thisChart, {
<canvas id="myChart" width="400" height="400"></canvas>
<script>
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
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
</script>
});
*/
module.exports = router;