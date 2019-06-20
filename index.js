const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const passport = require('./config/passport')()
const chainController = require('./controllers/chains');
const orderController = require('./controllers/orders.js');
const userController = require('./controllers/users.js');
const userOrderController = require('./controllers/user-orders.js');
require('./db/models/ChipotleOrder');
require('./db/models/AndPizzaOrder');

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(cors());
app.use(passport.initialize())

app.use('/api/chains/', chainController);
app.use('/api/orders/', orderController);
app.use('/api/users/', userController);
app.use('/api/user-order/', userOrderController);

app.get('/', (req, res) => {
    res.redirect('/api/chains/');
});

app.set('port', process.env.PORT || 8040);

app.listen(app.get('port'), () => {
    console.log(`✅ PORT: ${app.get('port')} 🌟`);
});
