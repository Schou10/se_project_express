require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const {errors} = require('celebrate');
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const {requestLogger, errorLogger} = require('./middlewares/logger')

const app = express();
const { PORT = 3001 } = process.env;

mongoose.set('strictQuery', true);

mongoose
  .connect('mongodb://127.0.0.1:27017/wtwr_db')
  .catch(console.error);

app.use(express.json());

app.use(cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use("/", mainRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {})