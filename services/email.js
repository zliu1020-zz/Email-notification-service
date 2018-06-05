var mailSender = require('@sendgrid/mail');
var config = require('../config/config');
var _ = require('lodash');
var request = require('request-promise-native');
var config = require('../config/config');

var helper = {
    generateBatchID: async function(){
        var options = {
            method: 'POST',
            uri: 'https://api.sendgrid.com/v3/mail/batch',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`
            },
            json: true,

        };

        let response = await request(options);
        return response.batch_id;
    }
}
var service = {

    sendEmail: async function(recipients, from, content, subject, mailSettings){
        let fromAddress = from|| config.fromAddress;

        const msg = {
            to: recipients,
            from: fromAddress,
            html: `<p>${content}</p>`,
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

    sendScheduledEmail: async function(recipients, from, content, subject, scheduling, mailSettings){
        let moreThanOneRecipient = _.isArray(recipients) ? true : false;

        let fromAddress = from|| config.fromAddress;

        const msg = {
            to: recipients,
            from: fromAddress,
            html: `<p>${content}</p>`,
            subject: subject
        };

        let batchId = await helper.generateBatchID();

        if(moreThanOneRecipient){
            msg['send_each_at'] = parseInt(scheduling);
        }else{
            msg['send_at'] = parseInt(scheduling);
        }

        if(mailSettings){
            msg['mail_settings'] = mailSettings;
        }

        let result = await mailSender.send(msg);
        result[0]['batchId'] = batchId;

        return result;
    }
};

module.exports = service;