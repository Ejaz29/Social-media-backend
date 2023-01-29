const express = require('express');
const userRouter = require('./Router/userRouter');
const appError = require('./Utils/appError');
const globalErrorHandler = require('./Utils/errorHandlingMiddleware');

const app = express();

app.use(express.json());

app.use('/api', userRouter);

app.all('*', (req, res, next) => {
  return next(new appError('Cannot find the path', 401));
});

app.use(globalErrorHandler);

module.exports = app;
