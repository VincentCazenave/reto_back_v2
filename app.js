const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require('path');
var morgan = require('morgan');
const bodyParser = require('body-parser');
var fs = require('fs');
const helmet = require("helmet");
const userRoutes = require('./routes/user.routes'); // import the user routes
const challRoutes = require('./routes/challenge.routes'); // import challenges routes
const app = express();

app.use( bodyParser.json() );       //to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(helmet({contentSecurityPolicy: false}));

global.__basedir = __dirname;

require('dotenv').config();
var corsOptions = {
  origin: '*',
  /* methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeader: ['X-Requested-With','content-type'],
  credentials: true */
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.urlencoded({extended: true, limit: '100mb', parameterLimit: 500000}));
app.use(express.json({limit: '100mb', parameterLimit: 500000}));


app.use('/', userRoutes); //to use the user routes
app.use('/', challRoutes); //to use the challenge routes

app.post('/api/users', function(req, res) {
  const user_id = req.query.id;
  const token = req.query.token;
  const geo = req.body.geo;

  res.send({
    'user_id': user_id,
    'token': token,
    'geo': 'geo'
  });
});

// set port, listen for requests
 const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});



