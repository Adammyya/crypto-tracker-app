import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import { CoinContext } from '../../context/CoinContext';
import './Coin.css';

const Spinner = () => (
  <div className="spinner">
    <div className="spin"></div>
  </div>
);

const Coin = () => {
  const { coinId } = useParams();
  const { currency } = useContext(CoinContext);
  const [coinData, setCoinData] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const fetchData = async () => {
      setLoading(true);
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-cg-demo-api-key': 'CG-yv5LVXVSpZG6os3ZQTX6Xen5'
        },
        signal
      };

      const coinDetailsPromise = fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`, options);
      const historicalDataPromise = fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.name.toLowerCase()}&days=10`, options);

      try {
        const [coinDetailsResponse, historicalDataResponse] = await Promise.all([coinDetailsPromise, historicalDataPromise]);

        if (!coinDetailsResponse.ok) throw new Error(`Coin details fetch failed`);
        if (!historicalDataResponse.ok) throw new Error(`Chart data fetch failed`);

        const coinDetailsData = await coinDetailsResponse.json();
        const historicalChartData = await historicalDataResponse.json();

        setCoinData(coinDetailsData);

        const dataForChart = [['Date', 'Price']];
        historicalChartData.prices.forEach(item => {
          dataForChart.push([new Date(item[0]), item[1]]);
        });
        setHistoricalData(dataForChart);

      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error("Failed to fetch data:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [coinId, currency]);

  const chartOptions = {
    backgroundColor: 'transparent',
    legend: { position: 'none' },
    hAxis: {
      textStyle: { color: '#FFF' },
      gridlines: { color: 'transparent' }
    },
    vAxis: {
      textStyle: { color: '#FFF' },
      gridlines: { color: '#333' }
    },
    colors: ['#00d8ff'],
  };

  if (loading) {
    return <Spinner />;
  }

  if (!coinData || !historicalData) {
    return <div className="coin-error">Could not load data. Please try again.</div>;
  }

  return (
    <div className='coin'>
      <div className='coin-name'>
        <img src={coinData.image.large} alt={`${coinData.name} icon`} />
        <h1>{coinData.name} ({coinData.symbol.toUpperCase()})</h1>
        <p>Rank: #{coinData.market_cap_rank}</p>
      </div>
      <div className='coin-chart'>
        <Chart
          chartType="LineChart"
          data={historicalData}
          width="100%"
          height="400px"
          options={chartOptions}
        />
      </div>
      <div className='coin-details'>
        <ul>
          <li>Current Price: <span>{currency.symbol} {coinData.market_data.current_price[currency.name.toLowerCase()].toLocaleString()}</span></li>
          <li>Market Cap: <span>{currency.symbol} {coinData.market_data.market_cap[currency.name.toLowerCase()].toLocaleString()}</span></li>
          <li>24h High: <span>{currency.symbol} {coinData.market_data.high_24h[currency.name.toLowerCase()].toLocaleString()}</span></li>
          <li>24h Low: <span>{currency.symbol} {coinData.market_data.low_24h[currency.name.toLowerCase()].toLocaleString()}</span></li>
          <li>Total Volume: <span>{currency.symbol} {coinData.market_data.total_volume[currency.name.toLowerCase()].toLocaleString()}</span></li>
        </ul>
      </div>
      <div className='coin-description'>
        <h2>About {coinData.name}</h2>
        <div dangerouslySetInnerHTML={{ __html: coinData.description.en }}></div>
      </div>
    </div>
  );
};

export default Coin;
