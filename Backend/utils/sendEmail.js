const nodemailer = require("nodemailer");
const path = require("path")
const sendEmail = async (to, subject, html) => {
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
      html,
      attachments: [
    {
      filename: 'logo.png',
      path: path.join(__dirname, 'assets', 'logo.png'), // Make sure the logo is in your project folder
      cid: 'companylogo' // This matches the src="cid:companylogo" in the HTML
    }
  ]
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
