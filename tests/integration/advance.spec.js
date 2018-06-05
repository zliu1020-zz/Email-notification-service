var should = require('should');
var assert = require('assert');
var request = require('request-promise-native');
var app = require('../../app');

let server;
describe('Advanced API endpoint tests', () => {

    before(done => {
        server = app.listen(3000, done);
    });

    after(done => {
        server.close(done);
    });

    it('Sending an email without content should be rejected', async function() {
       try{
           var options = {
               method: 'POST',
               uri: 'http://localhost:3050/emails',
               body: {
                   "recipients": "test@uwaterloo.ca",
                   "subject": "TEST_SUBJECT",
                   "mail_settings": {
                       "sandbox_mode": {
                           "enable": true
                       }
                   }
               },
               json: true,

           };

           await request(options);
       }catch(e){
           let response = e.error;
           response.result.should.equal('failure');
           response.message.should.containEql('Missing mandatory field in request body: content');
           response.httpStatusCode.should.equal(400);
       }
    });

    it('Sending an email without recipients should be rejected', async function() {
        try{
            var options = {
                method: 'POST',
                uri: 'http://localhost:3050/emails',
                body: {
                    "subject": "TEST_SUBJECT",
                    "content": "TEST_CONTENT",
                    "mail_settings": {
                        "sandbox_mode": {
                            "enable": true
                        }
                    }
                },
                json: true,

            };

            await request(options);
        }catch(e){
            let response = e.error;
            response.result.should.equal('failure');
            response.message.should.containEql('Missing mandatory field in request body: recipients');
            response.httpStatusCode.should.equal(400);
        }
    });

    it('Sending an email without subject should be rejected', async function() {
        try{
            var options = {
                method: 'POST',
                uri: 'http://localhost:3050/emails',
                body: {
                    "recipients": "test@uwaterloo.ca",
                    "content": "TEST_CONTENT",
                    "mail_settings": {
                        "sandbox_mode": {
                            "enable": true
                        }
                    }
                },
                json: true,

            };

            await request(options);
        }catch(e){
            let response = e.error;
            response.result.should.equal('failure');
            response.message.should.containEql('Missing mandatory field in request body: subject');
            response.httpStatusCode.should.equal(400);
        }
    });

    it('Sending a scheduled email with past date should fail', async function() {
        try{
            var options = {
                method: 'POST',
                uri: 'http://localhost:3050/emails',
                body: {
                    "recipients": "test@uwaterloo.ca",
                    "subject": "TEST_SUBJECT",
                    "content": "TEST_CONTENT",
                    "sendAt": 1328243200,
                    "mail_settings": {
                        "sandbox_mode": {
                            "enable": true
                        }
                    }
                },
                json: true,

            };

            await request(options);
        }catch(e){
            let response = e.error;
            response.result.should.equal('failure');
            response.message.should.containEql('Desired time cannot be a past date');
            response.httpStatusCode.should.equal(400);
        }
    });

    it('Sending a scheduled email with both sendAt and sendEachAt should fail', async function() {
        try{
            var options = {
                method: 'POST',
                uri: 'http://localhost:3050/emails',
                body: {
                    "recipients": "test@uwaterloo.ca",
                    "subject": "TEST_SUBJECT",
                    "content": "TEST_CONTENT",
                    "sendAt": 1328243200,
                    "sendEachAt": [1328243200, 1328243200],
                    "mail_settings": {
                        "sandbox_mode": {
                            "enable": true
                        }
                    }
                },
                json: true,

            };

            await request(options);
        }catch(e){
            let response = e.error;
            response.result.should.equal('failure');
            response.message.should.containEql('Scheduling time should be specified by only one of sendEachAt and sendAt');
            response.httpStatusCode.should.equal(400);
        }
    });

});