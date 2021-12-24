import './App.css';
import { useState, useEffect } from "react";

function App() {
  const [stock, setStock] = useState("");
  const [quantity, setQuantity] = useState(0);

  const handleSearch = (event) => {
    console.log('handleSearch is working.');
    setStock(event.target.value);
  };

  const fetchSearch = async(event) => {
    console.log('fetchSearch is working.');
    let search = await fetch(`http://localhost:3000/yahoo/${stock}`);
    search = await search.json();
    alert(search.price);
  };

  return (
    <>
      <h1>Stock Manager</h1>
      <div className='flex-box'>
        <div className='stock-container'>
          <strong>Stock</strong>
          <h2>Which Stock Would You Like To See?</h2>
          <input type="text" onChange={handleSearch} value={stock} placeholder='Search for a stock' />
          <button className='searchbtn' type="submit" onClick={fetchSearch}>Search</button>
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