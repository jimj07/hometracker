const ERROR_MSG = require('../errormsg');
const hometracker = require('../hometracker');
const chaiAsPromised = require('chai-as-promised');
const expect = require('chai').expect;
const chai = require('chai');
chai.use(chaiAsPromised);

describe('Hometracker Tests', () => {
   describe('isValid', () => {
      it('should return false if payload is undefined', () => {
         let actual = hometracker.isValid({});
         expect(actual).to.be.false;
      });

      it('should return false if payload is not an array', () => {
         let actual = hometracker.isValid({
            'payload': {}
         });
         expect(actual).to.be.false;
      });

      it('should return true if payload is an empty array', () => {
         let actual = hometracker.isValid({
            'payload': [],
         })
         expect(actual).to.be.true;
      })

      it('should return false if the entity in payload contains nothing', () => {
         let actual = hometracker.isValid({
            'payload': [
               {},
               {}
            ]
         })
         expect(actual).to.be.false;
      });

      it('should return false if one of the entities in payload is invalid', () => {
         let actual = hometracker.isValid({
            'payload': [
               {
                  "address": {
                     "buildingNumber": "28",
                     "postcode": "2198",
                     "state": "NSW",
                     "street": "Donington Ave",
                     "suburb": "Georges Hall"
                  },
                  "type": "htv",
                  "workflow": "pending"
               },
               {
                  "type": "htv",
                  "workflow": "pending"
               }
            ]
         })
         expect(actual).to.be.false;
      });

      it('should return true if all the entities in payload are valid', () => {
         let actual = hometracker.isValid({
            "payload": [
               {
                  "address": {
                     "buildingNumber": "28",
                     "lat": -33.912542000000002,
                     "lon": 151.00293199999999,
                     "postcode": "2198",
                     "state": "NSW",
                     "street": "Donington Ave",
                     "suburb": "Georges Hall"
                  },
                  "propertyTypeId": 3,
                  "readyState": "init",
                  "reference": "aqsdasd",
                  "shortId": "6Laj49N3PiwZ",
                  "status": 0,
                  "type": "htv",
                  "workflow": "pending"
               },
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "NSW",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "propertyTypeId": 3,
                  "readyState": "init",
                  "reference": "asdasd",
                  "shortId": "E9eQVYEMkub2",
                  "status": 4,
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               }
            ]
         });
         expect(actual).to.be.true;
      });
   });

   describe('findCompletedHTV', () => {
      it('should reject error if data is invalid', () => {
         let result = hometracker.findCompletedHTV({
            "payload": [
               {}
            ]
         });
         return expect(result).to.eventually
            .be.rejectedWith(ERROR_MSG.INVALID_DATA);
      });

      it('should return one entity with the correct result in an array', () => {
         let result = hometracker.findCompletedHTV({
            "payload": [
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "NSW",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "propertyTypeId": 3,
                  "readyState": "init",
                  "reference": "asdasd",
                  "shortId": "E9eQVYEMkub2",
                  "status": 4,
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               },
            ]
         })

         return expect(result).to.eventually
            .deep.equal([
               {
                  "concataddress": "Level 6 146 Arthur Street North Sydney NSW 2060",
                  "type": "htv",
                  "workflow": "completed"
               }
            ]);
      });

      it('should return an empty array', () => {
         let result = hometracker.findCompletedHTV({
            "payload": [
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "NSW",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "pending"
               },
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "NSW",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "type": "abc",
                  "valfirm": null,
                  "workflow": "completed"
               }
            ]
         })

         return expect(result).to.eventually
            .deep.equal([]);
      });

      it('should return two entities in an array', () => {
         let result = hometracker.findCompletedHTV({
            "payload": [
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "NSW",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               },
               {
                  "address": {
                     "buildingNumber": "Level 9",
                     "postcode": "2010",
                     "state": "NSW",
                     "street": "11 George Street",
                     "suburb": "Burwood"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               }
            ]
         })

         return expect(result).to.eventually
            .deep.equal([
               {
                  "concataddress": "Level 6 146 Arthur Street North Sydney NSW 2060",
                  "type": "htv",
                  "workflow": "completed"
               },
               {
                  "concataddress": "Level 9 11 George Street Burwood NSW 2010",
                  "type": "htv",
                  "workflow": "completed"
               }
            ]);
      });
   });

   describe('find', () => {
      it('should return the same set of data if query is undefined', () => {
         let query = undefined;
         let result = hometracker.find({
            "payload": [
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "NSW",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               },
               {
                  "address": {
                     "buildingNumber": "Level 9",
                     "postcode": "2010",
                     "state": "NSW",
                     "street": "11 George Street",
                     "suburb": "Burwood"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               }
            ]
         }, query);

         return expect(result).to.eventually
            .deep.equal([
               {
                  "concataddress": "Level 6 146 Arthur Street North Sydney NSW 2060",
                  "type": "htv",
                  "workflow": "completed"
               },
               {
                  "concataddress": "Level 9 11 George Street Burwood NSW 2010",
                  "type": "htv",
                  "workflow": "completed"
               }
            ]);
      });
      it('should return the same set of data if query is empty', () => {
         let query = {};
         let result = hometracker.find({
            "payload": [
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "NSW",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               },
               {
                  "address": {
                     "buildingNumber": "Level 9",
                     "postcode": "2010",
                     "state": "NSW",
                     "street": "11 George Street",
                     "suburb": "Burwood"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               }
            ]
         }, query);

         return expect(result).to.eventually
            .deep.equal([
               {
                  "concataddress": "Level 6 146 Arthur Street North Sydney NSW 2060",
                  "type": "htv",
                  "workflow": "completed"
               },
               {
                  "concataddress": "Level 9 11 George Street Burwood NSW 2010",
                  "type": "htv",
                  "workflow": "completed"
               }
            ]);
      });

      it('should return the data with workflow as completed and type as htv', () => {
         let query = {
            "type": "htv",
            "workflow": "completed"
         };

         let result = hometracker.find({
            "payload": [
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "NSW",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               },
               {
                  "address": {
                     "buildingNumber": "Level 9",
                     "postcode": "2010",
                     "state": "NSW",
                     "street": "11 George Street",
                     "suburb": "Burwood"
                  },
                  "type": "abc",
                  "valfirm": null,
                  "workflow": "completed"
               }
            ]
         }, query);

         return expect(result).to.eventually
            .deep.equal([
               {
                  "concataddress": "Level 6 146 Arthur Street North Sydney NSW 2060",
                  "type": "htv",
                  "workflow": "completed"
               }
            ]);
      });

      it('should return the data with address.state as NSW and type as htv', () => {
         let query = {
            "address": {
               "state": "NSW"
            },
            "workflow": "completed"
         };

         let result = hometracker.find({
            "payload": [
               {
                  "address": {
                     "buildingNumber": "Level 6",
                     "postcode": "2060",
                     "state": "ACT",
                     "street": "146 Arthur Street",
                     "suburb": "North Sydney"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               },
               {
                  "address": {
                     "buildingNumber": "Level 9",
                     "postcode": "2010",
                     "state": "NSW",
                     "street": "11 George Street",
                     "suburb": "Burwood"
                  },
                  "type": "htv",
                  "valfirm": null,
                  "workflow": "completed"
               }
            ]
         }, query);

         return expect(result).to.eventually
            .deep.equal([
               {
                  "concataddress": "Level 9 11 George Street Burwood NSW 2010",
                  "type": "htv",
                  "workflow": "completed"
               }
            ]);
      });
   });
});
