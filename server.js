const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
 
dotenv.config();

// instantiate express
const app = express();

// routers
const userRouter = require('./routes/register');

// configure cors
app.use(cors());

const port = process.env.PORT || 3001;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  
    next();
})

// configure bodyparser
app.use(bodyParser.json({ extended : true }));

// welcome route
app.get('/', (req, res) => {
    res.status(200).json(({
        status: 'success',
        message: 'welcome to the blog api'
    }))
})

// app router
app.use('/api/v1/', userRouter);

// wronge routes
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        error: 'wrong route'
    })
})

app.listen(port,() => {
    console.log(`app is running on ${port}`)
})

module.exports = app;