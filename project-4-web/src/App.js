import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [stock, setStock] = useState("");
  const [results, setResults] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [portfolio, setPortfolio] = useState([]);
  const [money, setMoney] = useState(1000);

  const handleSearch = (event) => {
    console.log("handleSearch is working.");
    setStock(event.target.value);
  };

  const fetchSearch = async (event) => {
    console.log("fetchSearch is working.");
    let search = await fetch(`http://localhost:3000/api/yahoo/${stock}`); // Update this route
    search = await search.json();
    if (!search.error) {
      setResults(search.api);
    }
    else {
      alert('Data not found.');
    }
  };

  const buyStock = async (event) => {
    console.log("The Buy button was clicked.");
    if (quantity <= 0) {
      alert("Quantity cannot be zero or a negative number.");
    } else {
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
        });
        console.log(check);
        if (!check) {
          setMoney(parseFloat(money - stocksBought).toFixed(2));
          setPortfolio([...portfolio, [stock, quantity, stocksBought]]);
        }
      }
      else {
        alert("You do not have enough money to invest in this stock.");
      }
    }

  };

  const resetPortfolio = async (event) => {
    if (portfolio.length === 0) {
      alert("Your portfolio is empty!");
    }
    else {
      setMoney(1000);
      setPortfolio([]);
    }
  };

  console.log(results.api);
  console.log(results);

  return (
    <>
      <h1>Stock Manager</h1>
      <h2>Balance: {money}</h2>
      <div className='flex-box'>
        <div className='stock-container'>
          <strong>Stock</strong>
          <h2>Which Stock Would You Like To See?</h2>
          <input type="text" onChange={handleSearch} value={stock} placeholder="Search for a stock" />
          <button className='searchbtn' type="submit" onClick={fetchSearch}>Search</button>
          {(results && results.price) && (
            <>
              <div>{results.price}</div>
              <div><button style={{ backgroundColor: "green" }} onClick={buyStock}>Buy</button></div>
              <div><label>How much would you like to buy?: </label><input type="number" onChange={(event) => setQuantity(event.target.value)} value={quantity} style={{ width: "50px", marginTop: "10px" }} min="1" max="10" /></div>
            </>)}
        </div>
        <div className='portfolio-container'>
          <strong>Portfolio</strong>
          <div><button style={{ backgroundColor: "red", color: "white", margin: "10px", size: "150px" }} onClick={resetPortfolio}>RESET</button></div>
          <div className='grid-container'>
            <div className='grid-header grid-item'>Stock</div>
            <div className='grid-header grid-item'>Quantity</div>
            <div className='grid-header grid-item'>Value</div>
            <div className='grid-header grid-item'>Buy/Sell</div>
            {portfolio.map((newStock) => {
              return (
                <>
                  <div className='grid-item'>{newStock[0]}</div>
                  <div className='grid-item'>{newStock[1]}</div>
                  <div className='grid-item'>{newStock[2]}</div>
                  <div className='grid-item'><button style={{ backgroundColor: "green" }}>Buy</button><button style={{ backgroundColor: "red" }}>Sell</button></div>
                </>
              )
            })}

          </div>
        </div>
      </div>
    </>
  );
};

export default App;