const express = require('express');
const bodyParser = require('body-parser');
const ERROR_MSG = require('./errormsg');
const hometracker = require('./hometracker');
const port = process.env.PORT || 3000;
const app = express();


app.use(bodyParser.json());

app.post('/', function (req, res) {
   console.log("received a request");
   console.log(`Request: \n ${JSON.stringify(req.body, null, 3)}`);

   console.log("findCompletedHTV");
   hometracker.findCompletedHTV(req.body)
      .then((result) => {
         console.log(`Result: \n ${JSON.stringify(result, null, 3)}`);
         res.json({
            "response": result
         });
      })
      .catch(() => {
         res.status(400)
            .json({
               "error": ERROR_MSG.FAILED_TO_PARSE
            });
      })
})

app.listen(port, () => {
   console.log(`Hometracker is listening on port ${port}`);
});
module.exports = app;