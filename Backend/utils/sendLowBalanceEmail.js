const nodemailer = require("nodemailer");
const path = require("path");

const sendLowBalanceEmail = async (user, balance) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "⚠ Low Balance Alert",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 40px; background: url('cid:companylogo') no-repeat center 100px; background-size: 250px;">
        <div style="background-color: rgba(255, 255, 255, 0.5); padding: 20px;">
          <h2>Hi ${user.fullName},</h2>

          <p><strong>⚠ Low Balance Alert</strong></p>
          <p>Your current balance is <strong>₹${balance}</strong>.</p>
          <p>Your balance is below 10% of your total income. Please spend wisely to avoid overspending and maintain financial stability.</p>

          <p><strong>Helpful Tips:</strong></p>
          <ul>
            <li>Review your recent expenses</li>
            <li>Avoid unnecessary or impulsive spending</li>
            <li>Adjust your weekly or monthly budget if needed</li>
            <li>Track any upcoming bills or recurring payments</li>
          </ul>

          <p>Thank you,<br>The Storm Ledgers Team</p>

          <hr style="margin-top: 30px;">
          <small style="color: #555;">Need help or support? Email us at <a href="mailto:stormledgers.care@gmail.com">stormledgers.care@gmail.com</a></small>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname,'assets', 'logo.png'), // adjust if your logo is elsewhere
        cid: 'companylogo'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendLowBalanceEmail };