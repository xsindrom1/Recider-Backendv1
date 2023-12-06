const express = require('express');
const cors = require('cors');
const { setupRoutes } = require('./route');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

setupRoutes(app);

app.get('/', (req, res) => {
  return res.status(200).send('Welcome to Recider');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
