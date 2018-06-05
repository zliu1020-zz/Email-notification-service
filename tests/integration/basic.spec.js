var should = require('should');
var assert = require('assert');
var request = require('request-promise-native');
var app = require('../../app');

let server;
describe('Basic API endpoint tests', () => {

    before(done => {
        server = app.listen(3000, done);
    });

    after(done => {
        server.close(done);
    });

    it('Send a regular email', async function() {
        var options = {
            method: 'POST',
            uri: 'http://localhost:3050/emails',
            body: {
                "recipients": "test@uwaterloo.ca",
                "content": "TEST_CONTENT",
                "subject": "TEST_SUBJECT",
                "mail_settings": {
                    "sandbox_mode": {
                        "enable": true
                    }
                }
            },
            json: true,

        };

        let response = await request(options);

        response.result.should.equal('success');
        response.message.should.equal('Email sent successfully');
        response.httpStatusCode.should.equal(200);
        response.batchId.should.not.be.null();
    });

    it('Send a regular email to multiple recipients', async function() {
        var options = {
            method: 'POST',
            uri: 'http://localhost:3050/emails',
            body: {
                "recipients": ["test@uwaterloo.ca","test1@uwaterloo.ca" ],
                "content": "TEST_CONTENT",
                "subject": "TEST_SUBJECT",
                "mail_settings": {
                    "sandbox_mode": {
                        "enable": true
                    }
                }
            },
            json: true,

        };

        let response = await request(options);

        response.result.should.equal('success');
        response.message.should.equal('Email sent successfully');
        response.httpStatusCode.should.equal(200);
        response.batchId.should.not.be.null();
    });

    it('Send a scheduled email', async function() {
        let timestamp = new Date();
        timestamp.setDate(timestamp.getDate() + 1);
        timestamp = timestamp.getTime() / 1000;

        var options = {
            method: 'POST',
            uri: 'http://localhost:3050/emails',
            body: {
                "recipients": "test@uwaterloo.ca",
                "content": "TEST_CONTENT",
                "subject": "TEST_SUBJECT",
                "sendAt": timestamp,
                "mail_settings": {
                    "sandbox_mode": {
                        "enable": true
                    }
                }
            },
            json: true,

        };

        let response = await request(options);

        response.result.should.equal('success');
        response.message.should.equal('Email sent successfully');
        response.httpStatusCode.should.equal(200);
        response.batchId.should.not.be.null();
    });

    it('Send a scheduled email to multiple recipients', async function() {

        let timestamp = new Date();
        timestamp.setDate(timestamp.getDate() + 1);
        timestamp = timestamp.getTime() / 1000;

        var options = {
            method: 'POST',
            uri: 'http://localhost:3050/emails',
            body: {
                "recipients": ["test@uwaterloo.ca","test1@uwaterloo.ca" ],
                "content": "TEST_CONTENT",
                "subject": "TEST_SUBJECT",
                "sendEachAt": [timestamp, timestamp],
                "mail_settings": {
                    "sandbox_mode": {
                        "enable": true
                    }
                }
            },
            json: true,

        };

        let response = await request(options);

        response.result.should.equal('success');
        response.message.should.equal('Email sent successfully');
        response.httpStatusCode.should.equal(200);
        response.batchId.should.not.be.null();
    });

});