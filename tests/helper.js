let supertest = require('supertest');
let chai = require('chai');
let uuid = require('uuid');
let app = require('../app');

global.app = app;
global.uuid = uuid;
global.expect = chai.expect;
global.request = supertest(app);