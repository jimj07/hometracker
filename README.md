# Hometracker
Find all the completed htv property.
## Design
**hometracker.js**
There are two public functions for this module: **isValid** & **findCompletedHTV**.

**isValid** checks if payload is valid. I also wrote a private function **isValidEntity** to valid every entity by a schema. This function checks if the entity contains all the properties specified in schema. It can be further developed to have the ability to validate the data type.

**findCompletedHTV** finds all the entities that has type as 'htv and workflow as 'completed'. It returns a promise that either reject an error when the data is invalid or resolve result. If the data is valid, I simply use Array.prototype.reduce() method together with a private function **createOutput** to transform the request data into the proper response data.

## How to run:
#### Start app
npm start
#### Run tests
npm test
#### Run tests with code coverage tool istanbul
npm run coverage