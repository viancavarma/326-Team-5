import express from "express";

const app = express();
const PORT = 3000;

// use mock data
const mockData = require('./mockData.json');

// Route to get the most expensive item
app.get('/api/most-expensive-item', (req, res) => {
  const mostExpensiveItem = mockData.reduce((max, item) => {
    const itemAmount = parseFloat(item.amount.replace('$', ''));
    const maxAmount = parseFloat(max.amount.replace('$', ''));
    return itemAmount > maxAmount ? item : max;
  });

  res.json(mostExpensiveItem); // Respond with the most expensive item
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});