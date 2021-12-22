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
}

function App() {
  return (
    <>
      <h1>Stock Manager</h1>
      <hr />
      <div className='flex-box'>
        <div className='stock-container'>
          <strong>Stock</strong>
          <h2>Which Stock Would You Like To See?</h2>
          <input type="text" />
          <button type="submit">Search</button>
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