const nodemailer = require("nodemailer");

let transporter = null;

async function setUpMailer() {
  try {
    let mailConfig = null;
    if (process.env.NODE_ENV === "production") {
      mailConfig = {
        service: process.env.MAIL_SERVICE,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      };
    } else {
      const {
        user,
        pass,
        smtp: { host, port, secure }
      } = await nodemailer.createTestAccount();
      mailConfig = {
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false
        },
        logger: true,
        debug: true
      };
    }
    transporter = nodemailer.createTransport(mailConfig);
  } catch (error) {
    console.error(error);
  }
}

async function sendMail(mailOptions) {
  try {
    if (transporter === null) {
      await setUpMailer();
    }
    const info = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV === "development") {
      console.log(nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = sendMail;
