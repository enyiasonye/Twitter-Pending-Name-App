const mongoose = require('mongoose');
const keys = require('./config/keys');
const connection = keys.MONGODB_URI;
mongoose
  .connect(connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('Database Connected Successfully'))
  .catch((err) => console.log(err));
