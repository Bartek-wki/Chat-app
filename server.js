const express = require('express');
const db = require('./messages');
const path = require('path');


const app = express();

app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/clientindex.html'));
});


app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});