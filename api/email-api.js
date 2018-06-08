let apiHelper = require('./components/api-helper');
let emailService = require('../services/email');
let InternalError = require('../error/InternalError');
let _ = require('lodash');
let moment = require('moment');
let logger = require('../logger/logger');

let emailAPI = {

    /**
     * API to send out regular email
     * @param Mandatory {string} or {array} recipients - email recipients
     * @param Mandatory {string} fromAddress - address from which emails are sent
     * @param Mandatory {string} content - email content
     * @param Mandatory{string} subject - email subject
     * @param Optional {object} mail_settings - additional mail settings
     */
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

            logger.debug(`Prepare to send regular email - recipients:${JSON.stringify(recipients)}, fromAddress:${fromAddress},
             subject: ${subject}, content:${content}, mailSettings: ${JSON.stringify(mailSettings)}`);

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

    /**
     * API to send out scheduled email
     * @param Mandatory {string} or {array} recipients - email recipients
     * @param Mandatory {string} fromAddress - address from which emails are sent
     * @param Mandatory {string} content - email content
     * @param Mandatory {string} subject - email subject
     * @param Mandatory {string} sendAt - scheduled time slot
     * @param Mandatory {Array} sendEachAt - scheduled time slots
     * @param Optional {object} mail_settings - additional mail settings
     */
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
                let desiredTimeArr = [];
                for(let time of scheduling){
                    time = moment(time).unix();
                    desiredTimeArr.push(time);
                    if(time < now){
                        throw new InternalError(`Desired time cannot be a past date`, InternalError.Types.UserError);
                    }
                }
                scheduling = desiredTimeArr;
            }else{
                scheduling = moment(scheduling).unix();

                if(scheduling < now){
                    throw new InternalError(`Desired time cannot be a past date`, InternalError.Types.UserError);
                }
            }

            logger.debug(`Prepare to send scheduled email - recipients:${JSON.stringify(recipients)}, fromAddress:${fromAddress},
             subject: ${subject}, content:${content}, scheduled time: ${JSON.stringify(scheduling)}, mailSettings: ${JSON.stringify(mailSettings)}`);

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