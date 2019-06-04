const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const chipotleOrderController = require('./controllers/chipotle-orders.js');
const userController = require('./controllers/users.js');

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(cors());

app.use('/api/chipotle-orders/', chipotleOrderController);
app.use('/api/users/', userController);

app.listen(8080, () => console.log('Server running on port 4040!'));
