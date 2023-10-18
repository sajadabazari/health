exports.sendEmail = (mailOptions,res) => {
  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    host: "mail.nikatarh.ir",
    port: 465,
    auth: {
      user: "sajad@nikatarh.ir",
      pass: "Fd=H._q=GN5P",
    },
  });
    const status =  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        res.status(422).json({
            statusCode: 422,
            message: `خطا در ارسال ایمیل بازنشانی!`,
          });
    } else {
      console.log("Email sent: " + info.response);
      res.json({
        statusCode: 200,
        message: `ایمیل بازنشانی با موفقیت ارسال شد!`,
      });
    }
  });
  console.log(status);

  return status;
};
