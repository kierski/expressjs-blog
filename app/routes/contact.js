var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('contact', { type: 'page', title: 'Contact' });
});

// send email
router.post('/send', function(req, res, next) {

  var transporter = nodemailer.createTransport({
    service: 'ForExampleGmail',
    auth: {
      user: 'example@example.com',
      pass: '####'
    }
  });

  var mailOptions = {
    from: '"Name Surname" <example@example.com>',
    to: 'example@gmail.com',
    subject: 'New message',
    text: `You have a submission from: Name: ${req.body.name}, email: ${req.body.email}, phone: ${req.body.phone}. Message: ${req.body.message}`,
    html: `<p>You have a submission from: </p> <ul><li>Name: ${req.body.name} </li><li>Email: ${req.body.email},</li><li> phone: ${req.body.phone} </li><li>Message: ${req.body.message}</li>`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    } else {
      res.redirect('/thanks');
    }
  });

});

module.exports = router;
