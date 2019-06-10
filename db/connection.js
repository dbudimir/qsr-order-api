const mongoose = require('mongoose');

mongoose.Promise = Promise;

let mongoURI = '';

if (process.env.NODE_ENV === 'production') {
    mongoURI = process.env.DB_URL;
} else {
    mongoURI = 'mongodb://localhost/qsr-order-api';
}

mongoose
    .connect(mongoURI, { useNewUrlParser: true })
    .then(instance => console.log(`Connected to db: ${instance.connections[0].name}`))
    .catch(error => console.log('Connection failed!', error));

module.exports = mongoose;

// heroku config:set DB_URL:"mongodb+srv://david:Berks^1bashers@cluster0-4i2eg.mongodb.net/test?retryWrites=true&w=majority"
