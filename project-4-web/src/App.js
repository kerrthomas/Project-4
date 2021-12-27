import './App.css';
import { useState, useEffect } from "react";

// 1. Display the results of the search from the fetchSearch function
// 2. Allow the user to buy a quantity of the stock they searched for (For now, don't worry about balance).
/* 3. When pressing the buy button, add it to the portfolio. Add it as a new row. Do you remember the function
      we can use with arrays in JSX so that it goes through each item in the array? */

function App() {
  const [stock, setStock] = useState("");
  const [results, setResults] = useState({});
  const [quantity, setQuantity] = useState(0);

  const handleSearch = (event) => {
    console.log('handleSearch is working.');
    setStock(event.target.value);
  };

  const fetchSearch = async(event) => {
    console.log('fetchSearch is working.');
    let search = await fetch(`http://localhost:3000/api/yahoo/${stock}`); // Update this route
    search = await search.json(); // Now that you have the json of the response, do something with it
    if(!search.error) {
      setResults(search.api);
    }
    else {
      alert('Data not found.');
    } 
  }; 

  return (
    <>
      <h1>Stock Manager</h1>
      <div className='flex-box'>
        <div className='stock-container'>
          <strong>Stock</strong>
          <h2>Which Stock Would You Like To See?</h2>
          <input type="text" onChange={handleSearch} value={stock} placeholder='Search for a stock' />
          <button className='searchbtn' type="submit"  onClick={fetchSearch}>Search</button>
          {(results != "" && results != null) && (<div>{results.price}</div>)}
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