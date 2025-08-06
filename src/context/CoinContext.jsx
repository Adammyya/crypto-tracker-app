import { createContext, useState, useEffect } from 'react';

export const CoinContext = createContext();


const CoinContextProvider = ({ children }) => {
  const [allCoins, setAllCoins] = useState([]);
  const [currency, setCurrency] = useState({
    name: 'USD',
    symbol: '$',
  });

  
  const fetchAllCoins = async () => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-cg-demo-api-key': 'CG-yv5LVXVSpZG6os3ZQTX6Xen5',
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
        options
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      setAllCoins(data);
    } catch (err) {
      console.error('Failed to fetch coin data:', err);
    }
  };

  useEffect(() => {  /* hook runs code with side effects (like fetching data). It takes two arguments: a function to run, and a "dependency array.*/
    fetchAllCoins();
  }, [currency]);

  const contextValue = {
    allCoins,
    currency,
    setCurrency,
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;