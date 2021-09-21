const request = require('request');
function callSendAPI(sender_psid, message) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: message,
  };

  request(
    {
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {
        access_token: process.env.PAGE_ACCESS_TOKEN,
      },
      method: 'POST',
      json: request_body,
    },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const recipientId = body.recipient_id;
        const messageId = body.message_id;
      } else {
        console.log('error',error, response.statusCode);
        
      }
    }
  );
}

module.exports = (io) => {
  

  // io.sockets.emit('message', 'hello');
  io.on('connection', (socket) => {
    socket.on('acceptUser', adminRes => {
      const message = {
        "text": adminRes.message
      }

      callSendAPI(adminRes.userID , message);
    })

    socket.on('sendMenu', ({userID, message}) => {
      console.log(message);
      const response = {
          "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":message,
              "buttons":[
                {
                  "type":"postback",
                  "title":"Hủy chat với admin",
                  "payload" : JSON.stringify({event : "stop"})
                },
                {
                  "type":"postback",
                  "title":"Chat to Admin",
                  "payload" : JSON.stringify({event : "liveChat"})
                },
              ]
            }

        
      }
      
    }
    callSendAPI(userID , response);
  })

      
    } )

  }
