let apiHelper = require('./components/api-helper');
let emailService = require('../services/email');
let InternalError = require('../error/InternalError');
let _ = require('lodash');
let moment = require('moment');

let emailAPI = {

    sendRegularEmail: async function(req, res){
        try{
            apiHelper.preProcess(req,
                {
                    mandatory: ['recipients', 'content', 'subject'],
                    optional: ['fromAddress', 'mail_settings']
                });

            let recipients = req.body.recipients;
            let fromAddress = req.body.fromAddress;
            let content = req.body.content;
            let subject = req.body.subject;
            let mailSettings = req.body.mail_settings;

            let result = await emailService.sendEmail(recipients, fromAddress, content, subject, mailSettings);

            let data = {
                result: 'success',
                message: 'Email sent successfully',
                httpStatusCode: 200,
                batchId: result[0].batchId
            };
            apiHelper.sendAPISuccess(req, res, data);

        }catch(e){
            apiHelper.sendAPIFailure(req, res, e);
        }
    },

    sendScheduledEmail: async function(req, res){

        try{
            apiHelper.preProcess(req,
                {
                    mandatory: ['recipients', 'content', 'subject'],
                    optional: ['fromAddress', 'sendEachAt', 'sendAt', 'mail_settings']
                });

            if(req.body.sendEachAt && req.body.sendAt){
                throw new InternalError(`Scheduling time should be specified by only one of sendEachAt and sendAt`, InternalError.Types.UserError)
            }

            let recipients = req.body.recipients;
            let fromAddress = req.body.fromAddress;
            let content = req.body.content;
            let subject = req.body.subject;
            let sendEachAt =  req.body.sendEachAt;
            let sendAt = req.body.sendAt;

            let scheduling = _.isArray(recipients) ? sendEachAt : sendAt;
            let mailSettings = req.body.mail_settings;

            let now = moment().unix();

            if(_.isArray(scheduling)){
                for(let time of scheduling){
                    time = moment(time).unix();
                    if(time < now){
                        throw new InternalError(`Desired time cannot be a past date`, InternalError.Types.UserError);
                    }
                }
            }else{
                scheduling = moment(scheduling).unix();

                if(scheduling < now){
                    throw new InternalError(`Desired time cannot be a past date`, InternalError.Types.UserError);
                }
            }

            let result = await emailService.sendScheduledEmail(recipients, fromAddress, content, subject, scheduling, mailSettings);

            let data = {
                result: 'success',
                message: 'Email sent successfully',
                httpStatusCode: 200,
                batchId: result[0].batchId
            };

            apiHelper.sendAPISuccess(req, res, data);

        }catch(e){
            apiHelper.sendAPIFailure(req, res, e);
        }

    },

    sendEmail: async function(req, res){

        if(req.body.sendEachAt || req.body.sendAt ){
            module.exports.sendScheduledEmail(req, res);
        }else{
            module.exports.sendRegularEmail(req, res);
        }
    }

};

module.exports = emailAPI;