//pushing change to test the webhook
// Import required modules
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const broken = false;

const indexRouter = require('./routes/index');
const trainsRouter = require('./routes/trains');

const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  res.locals = { broken: broken };
  next();
});

app.use('/', indexRouter);
app.use('/trains', trainsRouter);

// This endpoint performs CPU-intensive calculations
app.get('/generate-cpu-load', function(req, res, next) {
  let val = 0.0001;
  for (let i = 0; i < 1000000; i++) {
    val += Math.sqrt(val);
  }
  res.status(200).send('Doing a bunch of calculations!');
});

// This endpoint triggers the app to simulate entering an unhealthy state by causing it to return 5XX errors
app.get('/break', function(req, res, next) {
  broken = true;
  res.status(200).send('The app is now broken!');
});

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Set the port and listen
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
