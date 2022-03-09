import './styles/App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './Login.js';
import Register from './Register.js';

function App() {

  return (
    <BrowserRouter>
      <h1>Stock Manager</h1>
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

function Home() {
  const [stock, setStock] = useState("");
  const [results, setResults] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [portfolio, setPortfolio] = useState([]);
  const [money, setMoney] = useState(1000);
  const [transactions, setTransactions] = useState([]);
  const [resetted, setResetted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (sessionStorage.length > 0) {
        let data = await fetch(`http://localhost:3000/api/portfolio/${sessionStorage.getItem("userid")}`);
        data = await data.json();
        if (!data.error) {
          setPortfolio(data.results[0].portfoliodata == null ? [] : data.results[0].portfoliodata);
          data = await fetch(`http://localhost:3000/api/user/${sessionStorage.getItem("userid")}`);
          data = await data.json();
          if (!data.error) {
            setMoney(data.results[0].balance);
            data = await fetch(`http://localhost:3000/api/transactions/${sessionStorage.getItem("userid")}`);
            data = await data.json();
            if (!data.error) {
              if (data.results[0].log !== null) {
                setTransactions(data.results[0].log);
              }
            }
          }
        }
      }
    }
    fetchUserData();
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      savePortfolio();
    }
  }, [transactions]);

  useEffect(() => {
    if (resetted == true) {
      savePortfolio();
      setResetted(false);
    }
  }, [resetted]);

  const handleSearch = (event) => {
    console.log("handleSearch is working.");
    setStock(event.target.value);
  };

  const fetchSearch = async (event) => {
    console.log("fetchSearch is working.");
    let search = await fetch(`http://localhost:3000/api/yahoo/${stock}`);
    search = await search.json();
    if (!search.error) {
      setResults(search.api);
      console.log(`http://localhost:3000/api/chart/${stock}`)
      let myChart = await fetch(`http://localhost:3000/api/chart/${stock}`);
      myChart = await myChart.json();
      document.getElementById('myChart').setAttribute("src", myChart.sendChart);
    }
    else {
      alert('Data not found.');
    }
  };

  const buyStock = async (event) => {
    console.log("The Buy button was clicked.");
    if (quantity <= 0) {
      alert("Quantity cannot be zero or a negative number.");
    }
    else {
      let stocksBought = parseFloat(results.price * quantity).toFixed(2);
      if (money >= stocksBought) {
        console.log(stock);
        console.log(quantity);
        console.log(stocksBought);
        let check = false;
        portfolio.map((item) => {
          if (item[0] === stock) {
            check = true;
            alert("You already bought this stock.");
          }
        }); // Closes map function
        if (!check) {
          setMoney(parseFloat(money - stocksBought).toFixed(2));
          setPortfolio([...portfolio, [stock, quantity, parseFloat(stocksBought)]]);
          setTransactions([...transactions, `Bought ${quantity} stock(s) in ${stock}.`]);
        }
        else {
          alert("You do not have enough money to invest in this stock.");
        }
      }
    }
  };

  const resetPortfolio = async (event) => {
    if (transactions.length === 0) {
      alert("Your portfolio is empty!");
    }
    else {
      setMoney(1000);
      setPortfolio([]);
      setTransactions([]);
      setResetted(true);
    }
  };

  const savePortfolio = async (event) => {
    let data = await fetch(`http://localhost:3000/api/portfolio`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        portfoliodata: portfolio.length > 0 ? portfolio : null, userid: sessionStorage.getItem("userid")
      })
    });
    data = await data.json();
    if (!data.error) {
      let data = await fetch(`http://localhost:3000/api/transactions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          log: transactions, userid: sessionStorage.getItem("userid")
        })
      })
      if (!data.error) {
        let data = await fetch(`http://localhost:3000/api/balance`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            balance: money, userid: sessionStorage.getItem("userid")
          })
        })
        if (!data.error) {
        }
        else {
          alert("There was an error.");
        }
      }
      else {
        alert("There was an error.")
      }
    }
  }

  const buyPortfolio = async (event) => {
    console.log("Buy portfolio button was clicked!");
    let newQuantity = parseInt(portfolio[event.target.id][1]) + 1;
    let newPortfolio = [];
    portfolio.map((item) => {
      newPortfolio.push(item);
    })
    let bought = parseFloat((portfolio[event.target.id][2] / portfolio[event.target.id][1]) * newQuantity);
    let newMoney = parseFloat(parseFloat(money) - (portfolio[event.target.id][2] / portfolio[event.target.id][1]));
    if (newMoney >= 0) {
      newPortfolio[event.target.id][2] = parseFloat(bought.toFixed(2));
      newPortfolio[event.target.id][1] = newQuantity;
      setPortfolio(newPortfolio);
      setMoney(newMoney.toFixed(2));
      setTransactions([...transactions, `Bought 1 stock in ${portfolio[event.target.id][0]}.`]);
    } else {
      alert("You don't have enough money to invest in another stock.");
    }
  };

  const sellPortfolio = async (event) => {
    console.log("Sell portfolio button was clicked!");
    let newQuantity = parseInt(portfolio[event.target.id][1]) - 1;
    let newPortfolio = [];
    portfolio.map((item) => {
      newPortfolio.push(item);
    })
    let sold = parseFloat((portfolio[event.target.id][2] / portfolio[event.target.id][1]) * newQuantity);
    let newMoney = parseFloat((portfolio[event.target.id][2] / portfolio[event.target.id][1]) + parseFloat(money));
    if (newQuantity > 0) {
      newPortfolio[event.target.id][2] = parseFloat(sold.toFixed(2));
      newPortfolio[event.target.id][1] = newQuantity;
      setPortfolio(newPortfolio);
      setMoney(newMoney.toFixed(2));
      setTransactions([...transactions, `Sold 1 stock in ${portfolio[event.target.id][0]}.`]);
    }
    else {
      newPortfolio.splice(event.target.id, 1);
      setPortfolio(newPortfolio);
      setMoney(newMoney.toFixed(2));
      setTransactions([...transactions, `Sold 1 stock in ${portfolio[event.target.id][0]}.`]);
    }
  };

  console.error('Transaction Log: ', transactions)

  const transactionLog = async (event) => {
    let buyQuantity = parseInt(portfolio[event.target.id][1]) + 1;
    let sellQuantity = parseInt(portfolio[event.target.id][1]) - 1;
    let buyLog = parseFloat((portfolio[event.target.id][2] / portfolio[event.target.id][1]) * buyQuantity);
    let sellLog = parseFloat((portfolio[event.target.id][2] / portfolio[event.target.id][1]) * sellQuantity);
  };

  return (
    <>
      {sessionStorage.getItem("username") && (
        <h2>Balance: ${money}</h2>
      )}
      {sessionStorage.getItem("username") && (
        <div>
          <div style={{ fontWeight: 'bold' }}>Welcome, {sessionStorage.getItem("username")}</div>
          <button onClick={() => { sessionStorage.clear(); alert("You have logged out!"); window.location.reload(); }} id="logoutbtn" type="button">Logout</button>
        </div>
      )}
      {!sessionStorage.getItem("username") && (
        <span>
          <Link to='/login'><button className='userbuttons'>Login</button></Link>
          <Link to='/register'><button className='userbuttons'>Register</button></Link>
        </span>
      )}
      <div className='flex-box'>
        <div className='stock-container'>
          <strong>Stock</strong>
          <h2>Which Stock Would You Like To See?</h2>
          <input type="text" onChange={handleSearch} value={stock} placeholder="Search for a stock" />
          <button id='searchbtn' type="submit" onClick={fetchSearch}>Search</button>
          {(results && results.price) && (
            <>
              <div style={{ backgroundColor: "white" }}><img id="myChart" style={{ width: "50%", maxWidth: "500px" }}></img></div>
              <div>{results.price}</div>
              <div><button style={{ backgroundColor: "green" }} onClick={buyStock}>Buy</button></div>
              <div><label>How much would you like to buy?: </label><input type="number" onChange={(event) => setQuantity(event.target.value)} value={quantity} style={{ width: "50px", marginTop: "10px" }} min="1" max="10" /></div>
            </>
          )}
        </div>
        <div className='portfolio-container'>
          <strong>Portfolio</strong>
          <div>
            <button style={{ backgroundColor: "red", color: "white", margin: "10px", size: "150px" }} onClick={resetPortfolio}>RESET</button>
          </div>
          <div className='grid-container'>
            <div className='grid-header grid-item'>Stock</div>
            <div className='grid-header grid-item'>Quantity</div>
            <div className='grid-header grid-item'>Value</div>
            <div className='grid-header grid-item'>Buy/Sell</div>
            {portfolio.map((item, idx) => {
              return (
                <>
                  <div className='grid-item'>{item[0]}</div>
                  <div className='grid-item'>{item[1]}</div>
                  <div className='grid-item'>{item[2]}</div>
                  <div className='grid-item'><button style={{ backgroundColor: "green" }} id={idx} onClick={buyPortfolio}>Buy</button><button style={{ backgroundColor: "yellow" }} id={idx} onClick={sellPortfolio}>Sell</button></div>
                </>
              )
            })}
          </div>
          {transactions.length > 0 && (
            <div style={{ marginTop: '5px', overflowY: "auto" }}><strong>Transaction Log:</strong><br />
              <textarea cols={100} rows={25} value={transactions.map((item) => {
                return item + '\n'
              })} readOnly>
              </textarea>
            </div>
          )}
        </div>
      </div>
    </>
  )
};
export default App;