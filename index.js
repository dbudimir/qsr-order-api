const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const chainController = require('./controllers/chains');
const userController = require('./controllers/users.js');
require('./db/models/ChipotleOrder');
require('./db/models/AndPizzaOrder');

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(cors());

app.use('/api/chains/', chainController);
// app.use('/api/chipotle-order/', chipotleOrderController);
app.use('/api/users/', userController);

app.listen(8080, () => console.log('Server running on port 8080!'));
