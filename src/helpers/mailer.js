const nodemailer = require("nodemailer");

let transporter = null;

async function setUpMailer() {
  try {
    const { user, pass } = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 465,
      secure: true,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false
      }
    });
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
    console.log(nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error(error);
  }
}

module.exports = sendMail;
