let mailSender = require('@sendgrid/mail');
let config = require('../config/config');
let _ = require('lodash');
let request = require('request-promise-native');

let helper = {
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
        return response.batch_id;
    }
}
let service = {

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

    sendScheduledEmail: async function(recipients, from, content, subject, desiredTime, mailSettings){
        let moreThanOneRecipient = _.isArray(recipients) ? true : false;

        let fromAddress = from|| config.fromAddress;

        const msg = {
            to: recipients,
            from: fromAddress,
            html: `<p>${content}</p>`,
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