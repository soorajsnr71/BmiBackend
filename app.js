// app.js

const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./authRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
