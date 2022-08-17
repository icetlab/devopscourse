var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var path = require('path');
var cors = require('cors');
var history = require('connect-history-api-fallback');

var productsController = require('./controllers/products');
var ordersController = require('./controllers/orders');

// Variables
var mongoHost = process.env.MONGODB_HOST || 'localhost';
var mongoDB = process.env.MONGODB_DB || 'scalyDB';
var mongoPort = process.env.MONGODB_PORT || '27017';
var mongoUser = process.env.MONGODB_USER || undefined;
var mongoPW = process.env.MONGODB_PW || undefined;
var port = process.env.PORT || 5045;

// Connect to MongoDB
// Connection string format: mongodb://root:hugo@localhost:27017/scalyDB
// (or alternatively, without authentication: mongodb://localhost:27017/scalyDB)
if(mongoUser) {
    var mongoUri = "mongodb://"+mongoUser+":"+mongoPW+"@"+mongoHost+":"+mongoPort+"/"+mongoDB
} else {
    var mongoUri = "mongodb://"+mongoHost+":"+mongoPort+"/"+mongoDB
}

console.log("Trying to connect to "+mongoUri)
mongoose.connect(mongoUri, { useNewUrlParser: true }, function(err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoUri}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoUri}`);
});

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(bodyParser.json());
// HTTP request logger
app.use(morgan('dev'));
// Enable cross-origin resource sharing for frontend must be registered before api
app.options('*', cors());
app.use(cors());

// these are some testing routes that may come in handy during the project

app.get('/', function(req, res) {
    res.json({'message': 'OK'});
});

app.get('/api/serverstatus', function(req, res) {
    res.json({'message': 'Your server appears to be live and well.'});
});

// return an error (on purpose, for monitoring testing)
app.post('/api/error', function(req, res, next) {
    var errorcode = req.query.statuscode || 404;
    console.log("Generating error on purpose: "+errorcode);
    res.status(errorcode).json({'Error': true});
});

// go into an endless loop (this will block the entire server)
app.post('/api/crash', function(req, res, next) {
    console.log("Crash server via an endless loop");
    for(;;);
});

app.use(productsController);
app.use(ordersController);

// Catch all non-error handler for api (i.e., 404 Not Found)
app.use('/api/*', function (req, res) {
    res.status(404).json({ 'message': 'Not Found' });
});

// Configuration for serving frontend in production mode
// Support Vuejs HTML 5 history mode
app.use(history());
// Serve static assets
var root = path.normalize(__dirname + '/..');
var client = path.join(root, 'client', 'dist');
app.use(express.static(client));

// Error handler (i.e., when exception is thrown) must be registered last
var env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        'message': err.message,
        'error': {}
    };
    if (env === 'development') {
        err_res['error'] = err;
    }
    res.status(err.status || 30);
    res.json(err_res);
});

app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}, in ${env} mode`);
    console.log(`Backend: http://localhost:${port}/api/`);
    console.log(`Frontend (production): http://localhost:${port}/`);
});

module.exports = app;