const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
var User = require('./Models/user.js');
const cors = require('cors');

//DB set-up
mongoose.connect('mongodb://localhost:auth/serverauth');


//App set-up
app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));


router(app);


//Server set-up
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, function(err){
  console.log('Server running in port: ' + port);
});
