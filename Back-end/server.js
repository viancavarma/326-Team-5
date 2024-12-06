import express from "express";

const app = express();
const PORT = 3000;

// use mock data
const mockData = require('./mockData.json');

// Route for fetching the most expensive expense
app.get('/api/most-expensive-item', (req, res) => {
  const mostExpensive = mockData.reduce((max, item) => {
    const amount = parseFloat(item.amount.replace('$', ''));
    return amount > max.amount ? { ...item, amount } : max;
  }, { amount: 0 });
  res.json(mostExpensive);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});