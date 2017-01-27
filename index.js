const express = require('express');
const bodyParser = require('body-parser');
const ERROR_MSG = require('./errormsg');
const hometracker = require('./hometracker');
const port = process.env.PORT || 3000;
const app = express();


app.use(bodyParser.json());

app.post('/', function (req, res) {
   console.log("received a request");
   if (!req.body || !hometracker.isValid(req.body)) {
      console.log("Invalid request");
      res.status(400)
         .json({
            "error": ERROR_MSG.FAILED_TO_PARSE
         });
   } else {
      console.log(req.body);
      console.log("findCompletedHTV");
      hometracker.findCompletedHTV(req.body)
         .then((result) => {
            console.log(result);
            res.json({
               "response": result
            });
         })
   }
})

app.listen(port, () => {
   console.log(`Hometracker is listening on port ${port}`);
});
module.exports = app;