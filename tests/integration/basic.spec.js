let request = require('request-promise-native');
let moment = require('moment');

let basicTestModule = [
    {
        description: 'Send a regular email',
        test: async () => {
            let options = {
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
        }
    },

    {
        description: 'Send a regular email to multiple recipients',
        test: async () => {
            let options = {
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
        }
    },

    {
        description: 'Send a scheduled email',
        test: async () => {
            let tomorrow  = moment(new Date()).add(1,'days').endOf('day').format('YYYY-MM-DD HH:mm:ss');

            let options = {
                method: 'POST',
                uri: 'http://localhost:3050/emails',
                body: {
                    "recipients": "test@uwaterloo.ca",
                    "content": "TEST_CONTENT",
                    "subject": "TEST_SUBJECT",
                    "sendAt": tomorrow,
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
        }
    },

    {
        description: 'Send a scheduled email',
        test: async () => {
            let tomorrow  = moment(new Date()).add(1,'days').endOf('day').format('YYYY-MM-DD HH:mm:ss');

            let options = {
                method: 'POST',
                uri: 'http://localhost:3050/emails',
                body: {
                    "recipients": ["test@uwaterloo.ca","test1@uwaterloo.ca" ],
                    "content": "TEST_CONTENT",
                    "subject": "TEST_SUBJECT",
                    "sendEachAt": [tomorrow, tomorrow],
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
        }
    }

];

module.exports = basicTestModule;
