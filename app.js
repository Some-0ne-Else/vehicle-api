require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const { vehiclesRouter, usersRouter, errorRouter } = require('./routers');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  PORT, DB_SERVER, DB_PORT, DB_NAME,
} = require('./utils/config');
const { limiter } = require('./utils/rate-limiter-config');

const corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
mongoose.connect(`mongodb://${DB_SERVER}:${DB_PORT}/${DB_NAME}`, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/', usersRouter);
app.use('/vehicles', vehiclesRouter);
app.use('*', errorRouter);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
