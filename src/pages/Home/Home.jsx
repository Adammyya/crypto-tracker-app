import React, { useEffect, useState } from 'react'
import './Home.css';
import { useContext } from 'react';
import { CoinContext } from '../../context/CoinContext';
import {Link} from 'react-router-dom'
export const Home = () => {

  const {allCoins, currency} = useContext(CoinContext);
  const[displayCoin, setDisplayCoin]=useState([]);
  const [input, setInput]=useState("");

  const inputHandler = (event) => {
    setInput(event.target.value);
    if (event.target.value==""){
      setDisplayCoin(allCoins)
    }
  }
//This function handles the search functionality which permits the webpage to reload with the searched coin
  const searchHandler= async (event) => {
    event.preventDefault();
    const coins= await allCoins.filter((item) => {
      return item.name.toLowerCase().includes(input.toLowerCase())
    });
    //bitcoin 
    //bit
    setDisplayCoin(coins); //display the searched coins
    console.log(coins);
    setInput(""); //reset the input field after search
  }

  useEffect(() => {setDisplayCoin(allCoins);

  }, [allCoins]);   /*one array and one dependency array*/
/* [] effect runs only one time. right after the component is first rendered on the screen 
the function re runs only if the value inside the dependency is changed 
[a,b] array with dependency, [a] no dependency; the effect runs after every single render of the component, [] empty array */



  return (
    <div className='home'>
      <div className='hero'>
        <h1>Largest <br/> Crypto Marketplace</h1>
        <p>Welcome to the world's largest CryptoCurrency MarketPlace.
          Sign up to explore the latest trends, prices, and news in the crypto world.
          Join millions of users and start trading today!
        </p>
        <form onSubmit={searchHandler}>
          <input onChange={inputHandler} list='coinlist' value={input} type= "text " placeholder='Search for a coin...' required />


          <datalist id= 'coinlist'> 
            {allCoins.map((item, index)=>
              (<option key={index} value ={item.name}/>))}  
          </datalist>


          <button type='submit'>Search</button>
        </form>
        </div>
        <div className="crypto-table">
          <div className="table-layout">
          <p>#</p>
          <p>Coins</p>
          <p>Price</p>
          <p style={{textAlign:"center"}}>24h Change</p>
          <p className='market-cap'>Market Cap</p>
          </div>
          {
            displayCoin.slice(0,10).map((item, index)=> (
              <Link to={ `/coin/${item.id}`} className="table-layout" key={index}>
                <p>{item.market_cap_rank}</p>
                <div>
                  <img src={item.image} alt="" />
                  <p>{item.name+ "-" + item.symbol}</p> 
                </div> 
                <p> {currency.symbol} {item.current_price} </p>
                <p className={(item.price_change_percentage_24h>0)? "green": "red"}>
                  {Math.floor(item.price_change_percentage_24h*100)/100} </p>
                <p className='market-cap'> {currency.symbol} {item.market_cap.toLocaleString()} </p>
              </Link>
            ))
          }
        </div>  
    </div>
  )
}

export default Home;
// Exporting Home component as default for easier imports in other files 
