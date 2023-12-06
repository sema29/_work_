import * as express from 'express';

const db = require('./database/db');
var cors = require('cors')
const apiData = require("./apiData.controllers");

const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
  methods:"*"
}

const app = express();


app.use('*', cors(corsOptions)) 

app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message : 'API Gateway'});
})

app.get("/getAllData", apiData.getAllData);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', '*');
  
  if (req.method === "OPTIONS") {
        return res.status(200).end();
  }
  next();
});

module.exports = app;

