import './App.css';
import { useState, useEffect } from "react";

const Api = (props) => {
  const [search, setSearch] = useState("");
  const [stock, setStock] = useState({});
  const [quantity, setQuantity ] = useState(0);
};

const handleSearch = (event) => {
  let newSearch = event.target.value;
  setSearch(newSearch);
};

const handleQuantity = (event) => {
  setQuantity(event.target.value);
};

const handleBuy = () => {
  console.log("handleBuy is in effect.");
  if(sessionStorage.length > 0 && quantity > 0) {
    let newWallet = parseFloat(props.wallet - (stock.value * quantity)).toFixed(2);
    let oldPortfolio = props.portfolio.map((item, idx) => {
      if(item.includes(stock.symbol)) {
        return true;
      } else {
        return false;
      };
    });
    if (newWallet >= 0) {
      console.log("oldPortfolio: ", oldPortfolio)
      if (oldPortfolio.includes(true)) {
        setQuantity(0)
        return alert("You have this stock in your portfolio. Buy more shares from there.");
      }
      else {
        props.setWallet(newWallet);
        props.setPortfolio([...props.portfolio, [stock.symbol, quantity, parseFloat(stock.value).toFixed(2)]]);
        setQuantity(0)
        setStock({});
      };
  };
};
};

const fetchSearch = async () => {
  let symbol = search;
  console.log(`http://localhost:3000/api/search/${symbol}`)
  let data = await fetch(`http://localhost:3000/api/search/${symbol}`);
  data = await data.json();
  if (data.error) {
    return alert("Data for this symbol could not be found.");
  }
  else {
    setStockData({ symbol: symbol, value: data.data.price.toFixed(2) });
    fetchChart(symbol);
  }
}

const fetchChart = async (symbol) => {
  let chart = await fetch(`http://localhost:3000/api/chart?symbol=${symbol}`);
  chart = await chart.json();
  document.getElementById("chart-img").setAttribute('src', chart.img);
  
}

function App() {
  const [portfolio, setPortfolio] = useState(JSON.parse(sessionStorage.getItem("collection")) || []);
  const [wallet, setWallet] = useState(sessionStorage.getItem("wallet") || 5000);
  return (
    <>
      <h1>Stock Manager</h1>
      <hr />
      <div className='flex-box'>
        <div className='stock-container'>
          <strong>Stock</strong>
          <h2>Which Stock Would You Like To See?</h2>
          <input type="text" onChange={handleSearch} placeholder='Search for a stock'/>
          <button type="submit" onClick={fetchSearch}>Search</button>
        </div>
        <div className='portfolio-container'>
          <strong>Portfolio</strong>
          <div className='grid-container'>
            <div className='grid-header grid-item'>Stock</div>
            <div className='grid-header grid-item'>Quantity</div>
            <div className='grid-header grid-item'>Value</div>
            <div className='grid-header grid-item'>Buy/Sell</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;