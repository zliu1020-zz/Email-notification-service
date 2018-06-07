let app = require('../app');
let server;
let runTestGroup = ['basic', 'advance'];
let basicTests = require('./integration/basic.spec');
let advanceTests = require('./integration/advance.spec');

describe('Email Service Integration Tests', () => {

    before(done => {g
        server = app.listen(3000, done);
    });

    after(done => {
        server.close(done);
    });

    if(runTestGroup.includes('basic')){
        for(let testCase of basicTests){
            it(testCase.description, testCase.test);
        }
    }
    if(runTestGroup.includes('advance')){
        for(let testCase of advanceTests){
            it(testCase.description, testCase.test);
        }
    }
});