const express = require('express');
const appointment = require('./api/appointment');
const customer = require('./api/customer');
const payment = require('./api/payment');
const contact = require('./api/contact');
const feedback = require('./api/feedback');
const path = require('path');
const client = require('./db');
const logger = require('./logger');

const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, './src')));

app.use(appointment);
app.use(customer);
app.use(payment);
app.use(contact);
app.use(feedback);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});