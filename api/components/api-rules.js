let emailAPI = require('../email-api');

module.exports = [
    {
        method: 'post',
        endpoint: '/emails',
        description: 'Post request to send email',
        function: emailAPI.sendEmail
    }
]