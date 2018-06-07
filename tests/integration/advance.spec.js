let request = require('request-promise-native');
let should = require('should');

let advanceTestModule = [
    {
        description: 'Sending an email without content should be rejected',
        test: async () => {
            try{
                let options = {
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
        }
    },

    {
        description: 'Sending an email without recipients should be rejected',
        test: async () => {
            try{
                let options = {
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
        }
    },

    {
        description: 'Sending an email without subject should be rejected',
        test: async () => {
            try{
                let options = {
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
        }
    },

    {
        description: 'Sending a scheduled email with past date should fail',
        test: async () => {
            try{
                let options = {
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
        }
    },

    {
        description: 'Sending a scheduled email with both sendAt and sendEachAt should fail',
        test: async () => {
            try{
                let options = {
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
        }
    }

];

module.exports = advanceTestModule;
