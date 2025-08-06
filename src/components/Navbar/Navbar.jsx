import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CoinContext } from '../../context/CoinContext';
import './Navbar.css';
import logo from '../../assets/logo.png';
import arrow_icon from '../../assets/arrow_icon.png';

export const Navbar = () => {
  const { setCurrency } = useContext(CoinContext);

  const currencyHandler = (event) => {
    switch (event.target.value) {
      case "USD":
        setCurrency({ name: 'USD', symbol: '$' });
        break;
      case "EUR":
        setCurrency({ name: 'EUR', symbol: '€' });
        break;
      case "INR":
        setCurrency({ name: 'INR', symbol: '₹' });
        break;
      default:
        setCurrency({ name: 'USD', symbol: '$' });
        break;
    }
  };

  return (
    <div className='navbar'>
      <Link to="/">
        <img src={logo} alt="Cryptoplace Logo" className='logo' />
      </Link>
      
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/features">Features</Link>
        </li>
        <li>
          <Link to="/pricing">Pricing</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
      </ul>

      <div className="nav-right">
        <select onChange={currencyHandler}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="INR">INR</option>
        </select>
        <button>
          Sign up <img src={arrow_icon} alt="arrow icon" />
        </button>
      </div>
    </div>
  );
};