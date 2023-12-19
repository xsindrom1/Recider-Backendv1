const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { setupRoutes } = require('./routes/foodController/food.router');
const axios = require('axios');
const path = require('path')

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post('/recommend', async (req, res) => {
  const inputData = {
    ingredients: req.body.ingredients
  };
  try {
    if (inputData.ingredients && inputData.ingredients[0] === "") {
      return res.status(400).json({ error: "Bahan makanan tidak dimasukkan." });
    }

    const response = await axios.post('http://127.0.0.1:5000/recommend', inputData);

    if (response.status >= 200 && response.status < 300) {
      return res.status(200).json(response.data);
    } else {
      // Handle other non-2xx errors, including 404
      console.error('Error making request to Flask API. Status:', response.status);
      return res.status(response.status).json({ error: 'Resep makanan tidak ditemukan.' });
    }
  } catch (error) {
    // Handle network errors or other unexpected issues
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'Resep makanan tidak ditemukan.' });
    } else {
      console.error('Error making request to Flask API:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

setupRoutes(app);

app.get('/', (req, res) => {
  return res.status(200).send('Welcome to Recider');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
