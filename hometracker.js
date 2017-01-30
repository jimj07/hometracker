const _ = require('lodash');
const traverse = require('traverse');
const ERROR_MSG = require('./errormsg');

// Only checks the fields needed for building response data
const schema = {
   "workflow": true,
   "type": true,
   "address": {
      "buildingNumber": true,
      "postcode": true,
      "state": true,
      "street": true,
      "suburb": true,
   }
}

// validate data
function isValid(data) {
   if (!data.payload || !Array.isArray(data.payload)) {
      return false;
   } else {
      return _.every(data.payload, (prop) => {
         return validateEntity(prop, schema) === true;
      })
   }
};

// find all the entitties with type as htv and workflow as completed
function findCompletedHTV(data) {
   let query = {
      "type": "htv",
      "workflow": "completed"
   };
   return find(data, query);
};

// find all the entities that partilly deep equal to (contains) query object
function find(data, query) {
   return new Promise((resolve, reject) => {
      if (!isValid(data)) {
         reject(ERROR_MSG.INVALID_DATA);
      } else {
         let payload = data.payload;
         let result = payload.reduce((res, cur) => {
            if (_.isMatch(cur, query)) {
               res.push(createOuput(cur));
            }
            return res;
         }, []);
         resolve(result);
      }
   })
}

module.exports.isValid = isValid;
module.exports.findCompletedHTV = findCompletedHTV;
module.exports.find = find;

// ************************************************************ //
//                     Private Functions                        //
// ************************************************************ //

// check if entity contains all the properties specify in schema
function validateEntity(data, schema) {
   let valid = true;

   // get every possible non-cyclic path in the object
   let paths = traverse(schema).paths();

   for (let path of paths) {
      // check if data has value in each path
      if (!_.isEmpty(path) && _.get(data, path) === undefined) {
         valid = false;
         break;
      }
   }
   return valid;
};

function createOuput(data) {
   let ad = data.address;
   return {
      'concataddress': `${ad.buildingNumber} ${ad.street} ${ad.suburb} ${ad.state} ${ad.postcode}`,
      'type': 'htv',
      'workflow': 'completed',
   }
};