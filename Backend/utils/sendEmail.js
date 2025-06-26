const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    console.log(`Preparing to send email to ${to}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password (not your Gmail password)
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error);
    // DO NOT throw error here — just log it
    // That way, registration can succeed even if email fails
  }
};

module.exports = sendEmail;
