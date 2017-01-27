const chai = require('chai');
const request = require('supertest');
const app = require('../index');
const ERROR_MSG = require('../errormsg');
const sampleRequest = require('./hometrack-sample-response');
const sampleResponse = require('./hometrack-sample-response');
const expect = chai.expect;

describe('API Tests', function () {
   it('should return error when the request is invalid', function (done) {
      request(app)
         .post('/')
         .send("Invalid Data")
         .end((err, res) => {
            expect(res.statusCode).to.equal(400);
            expect(res.body).to.deep.equal({
               "error": ERROR_MSG.FAILED_TO_PARSE
            });
            done();
         });
   });

   it('should return data when the request is valid', () => {
      let reqData =
         request(app)
            .post('/')
            .send(sampleRequest)
            .end((err, res) => {
               expect(res.statusCode).to.equal(200);
               expect(res.body).to.deep.equal(sampleResponse);
               done();
            })
   });
});