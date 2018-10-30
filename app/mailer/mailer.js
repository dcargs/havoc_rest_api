var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'havoc.communications@gmail.com',
    pass: 'B84KQZZkw9P9'
  }
});

var mailOptions = {
  from: 'havoc.communications@gmail.com',
  to: "",
  subject: "",
  text: ""
};

module.exports = {
  send_welcome_email: async function(user){
    return new Promise(async function(resolve, reject) {
      let subject = "Welcome to Havoc Communications!";
      let text = "Welcome to Havoc Communications, "+user.first_name+". We're happy to have you!";
      let to = user.email;

      let result = await module.exports.send_mail(to, subject, text);
      if(result){
        resolve(result);
      } else {
        reject(result);
      }
    });
  },

  send_mail: async function(to, subject, text){
    return new Promise(function(resolve, reject) {
      mailOptions.to = to;
      mailOptions.subject = subject;
      mailOptions.text = text;

      console.log(mailOptions)
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(info.response);
        }
      });
    });
  }
}
