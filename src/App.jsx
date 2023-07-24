import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("EUR");
  const [exchangeRate, setExchangeRate] = useState(0);
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    fetchExchangeRate();
  }, [baseCurrency, targetCurrency]);

  const handleInput = (event) => {
    // Remove any non-numeric characters (except the dot) from the input value
    const inputValue = event.target.value.replace(/[^0-9.]/g, "");

    // Convert the cleaned input to a floating-point number
    const parsedValue = parseFloat(inputValue);

    // Check if the parsed value is a positive number or NaN (empty string or invalid input)
    if (!isNaN(parsedValue) && parsedValue >= 0) {
      // Update the state with the valid positive number
      setQuantity(parsedValue);
    } else {
      // If the input is not a positive number, set the state to 0
      setQuantity(0);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      const response = await axios.get(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
      );
      const rates = response.data.rates;
      if (targetCurrency in rates) {
        setExchangeRate(rates[targetCurrency]);
      } else {
        setExchangeRate(0);
      }
      setCurrencies(Object.keys(rates));
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const handleBaseCurrencyChange = (event) => {
    setBaseCurrency(event.target.value);
  };

  const handleTargetCurrencyChange = (event) => {
    setTargetCurrency(event.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded p-6">
        <h1 className="text-3xl font-bold mb-4">
          Currency Exchange Rate Viewer
        </h1>
        <div className="flex gap-2">
          <input
            type="number"
            name="number"
            onChange={handleInput}
            className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
          />
          <select
            className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            value={baseCurrency}
            onChange={handleBaseCurrencyChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <span className="text-2xl">to</span>
          <select
            className="px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-500"
            value={targetCurrency}
            onChange={handleTargetCurrencyChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <p className="text-2xl mt-2">
          {quantity} {baseCurrency} = {exchangeRate * quantity} {targetCurrency}
        </p>
      </div>
    </div>
  );
}

export default App;
