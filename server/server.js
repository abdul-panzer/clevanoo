const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.post("/api/contact", async (req, res) => {
  const { name, email, message, captcha } = req.body;

  // Verify reCAPTCHA
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const captchaVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}`;

  try {
    const captchaRes = await axios.post(captchaVerifyURL);
    if (!captchaRes.data.success) {
      return res.status(400).json({ message: "CAPTCHA verification failed." });
    }

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your SMTP provider
      auth: {
        user: process.env.EMAIL_USER, // info@clevanoollc.com
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Website Visitor" <${process.env.EMAIL_USER}>`,
      to: "info@clevanoollc.com",
      subject: "New Contact Message",
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p><p>${message}</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Server error. Message not sent." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
