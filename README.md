# Email notification service
- An email notification service build with Node.js, Express and Sendgrid
- Can be served as a building block for more complicated projects. 
- Regular emails and scheuled emails are supported. Recipients can be one or more.

## Usage Examples 
  - Welcome email upon user registration
  - Order confirmation email after online purchase
  - Appointment remainder email, etc. 
  
## Tech Stack
- Node.js, Express 
- Sendgrid, Request-promise
- Morgan, Winston
- Mocha, Should
  
## Instructions
- Download or clone the source code
- Run ```npm install``` at the root directory
- Run ```npm start``` to launch the service

## Update Configurations
- Navigate to config/config.js
  - Default API key, from which address emails are sent and HTTP ports can be overwritten
  
## API Usage
- POST http://localhost:3050/emails
- Body Parameter Specifications:
  - ```recipients``` {Mandatory}: String if only one recipient; array of string if multiple recipients  
  - ```content``` {Mandatory}: String of email content. HTML markup is supported.
  - ```subject``` {Mandatory}: String of email subject.
  - ```sendAt``` {Optional}: Schedule the time (EDT) in the future emails get sent. In the format of YYYY-MM-DD HH:MM:SS.
  - ```sendEachAt``` {Optional}: An array of scheduled time (EDT). Each is in the format of YYYY-MM-DD HH:MM:SS.
  - ```fromAddress``` {Optional}: The address from which emails are sent; default address will be used if not provided
  - ```mail_settings``` {Optional}: Optional mail settings as key value pair
    - ```sandbox_mode```: Set ```{"enable": true}``` for testing purposes. API will be envoked but emails won't be sent.
    - ```forward_spam```: Set ```{"enabled": true, "email": "ADDRESS_TO_FWD"}``` 
    - etc. More to be added.
    
## API Response
- Sample Response on success:
  ```
  {
    "result": "success",
    "message": "Email sent successfully",
    "httpStatusCode": 200,
    "batchId": "N2U4YzU5NzAtNmFhZS0xMWU4LWI0YzktNTI1NDAwMzM3MzZkLWVjMjg4NTlhNg"
  }
  ```
- Sample Response on failure:
  ```
  {
    "result": "failure",
    "message": "Email failed to be sent - Missing mandatory field in request body: subject",
    "httpStatusCode": 400
  }
  ```
  
