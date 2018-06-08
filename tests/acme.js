let app = require('../app');
let server;
let runTestGroup = ['basic', 'advance'];
let basicTests = require('./integration/basic.spec');
let advanceTests = require('./integration/advance.spec');

describe('Email Service Integration Tests', () => {

    before(done => {
        /** Initialize the server */
        server = app.listen(3000, done);
    });

    after(done => {
        /** Shut down the server */
        server.close(done);
    });

    /** Run basic tests */
    if(runTestGroup.includes('basic')){
        for(let testCase of basicTests){
            it(testCase.description, testCase.test);
        }
    }

    /** Run advanced tests */
    if(runTestGroup.includes('advance')){
        for(let testCase of advanceTests){
            it(testCase.description, testCase.test);
        }
    }
});