require('dotenv').config();
const PORT = process.env.PORT;
const URL_BASE = process.env.URL_BASE;
const express = require('express');
const ajax = require('ajax-request');
const app = express();
const SERVERS = process.env.SERVERS.split(',');

// pick which server to go to
let counter = 0;
const counterMax = SERVERS.length - 1;

const servicePicker = () => {
  let url = SERVERS[counter];
  if (counter < counterMax) {
    counter++
  } else {
    counter = 0;
  }
  return url;
};

// FORWARDS ALL REQUESTS
app.get('/*', (req, res) => {
  let targetService = servicePicker();
  targetService+= req.url;
  console.log('URL', targetService);

  ajax(targetService, (err, response, body) => {
    if (err) {
      console.log('LOAD BALANCER ERROR', err);
      res.sendStatus(404);
    } else {
      res.status(200);
      res.send(body);
    }
  })
});

// proof the server is running
app.listen(PORT, () => {
  console.log(`Product Overview Service is listening at ${URL_BASE} on port ${PORT}`);
});