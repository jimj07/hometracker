const express = require('express');
const bodyParser = require('body-parser');
const ERROR_MSG = require('./errormsg');
const hometracker = require('./hometracker');
const app = express();

app.use(bodyParser.json());

app.post('/', function (req, res) {
   if (!req.body || !hometracker.isValid(req.body)) {
      res.status(400)
         .json({
            "error": ERROR_MSG.FAILED_TO_PARSE
         });
   } else {
      let result = hometracker.findCompletedHTV(req.body);
      res.json({
         "response": result
      });
   }
})

app.listen(3000);

module.exports = app;