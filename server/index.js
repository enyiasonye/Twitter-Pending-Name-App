const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const path = require('path');
const app = express();
const routes = require('./routes/api');
const mongoose = require('mongoose');
require('./database');

app.use(bodyParser.json());
app.use(cors());

//since mongoose promise is depreciated, we overide it with node's promise
mongoose.Promise = global.Promise;

app.use('/api', routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
