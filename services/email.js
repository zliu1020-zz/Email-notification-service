let mailSender = require('@sendgrid/mail');
let config = require('../config/config');
let _ = require('lodash');
let request = require('request-promise-native');
let logger = require('../logger/logger');

let helper = {

    /** generate bacth id to track the current batch of emails */
    generateBatchID: async function(){
        let options = {
            method: 'POST',
            uri: 'https://api.sendgrid.com/v3/mail/batch',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`
            },
            json: true,

        };

        let response = await request(options);
        logger.debug(`BatchID generated: ${response.batch_id}`);
        return response.batch_id;
    }
}
let service = {

    /**
     * Service to send out email
     * @param {string} or {array} recipients - email recipients
     * @param {string} from - address from which emails are sent
     * @param {string} content - email content
     * @param {string} subject - email subject
     * @param {object} mailSettings - additional mail settings
     */
    sendEmail: async function(recipients, from, content, subject, mailSettings){
        let fromAddress = from|| config.fromAddress;

        const msg = {
            to: recipients,
            from: fromAddress,
            html: `${content}`,
            subject: subject
        };

        if(mailSettings){
            msg['mail_settings'] = mailSettings;
        }

        let result = await mailSender.send(msg);
        let batchId = await helper.generateBatchID();
        result[0]['batchId'] = batchId;
        return result;
    },

    /**
     * Service to send out scheduled email
     * @param {string} or {array} recipients - email recipients
     * @param {string} from - address from which emails are sent
     * @param {string} content - email content
     * @param {string} subject - email subject
     * @param {string} or {array} desiredTime - scheduled time slots
     * @param {object} mailSettings - additional mail settings
     */
    sendScheduledEmail: async function(recipients, from, content, subject, desiredTime, mailSettings){
        let moreThanOneRecipient = _.isArray(recipients) ? true : false;

        let fromAddress = from|| config.fromAddress;

        const msg = {
            to: recipients,
            from: fromAddress,
            html: `${content}`,
            subject: subject
        };


        if(moreThanOneRecipient){
            msg['send_each_at'] = desiredTime;
        }else{
            msg['send_at'] = desiredTime;
        }

        if(mailSettings){
            msg['mail_settings'] = mailSettings;
        }

        let result = await mailSender.send(msg);
        let batchId = await helper.generateBatchID();
        result[0]['batchId'] = batchId;

        return result;
    }
};

module.exports = service;