// routes/emailRoutes.js
const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

router.post("/send/:listId", async (req, res) => {
  const listId = req.params.listId;
  const users = await User.find({ list: listId, unsubscribed: false });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  for (const user of users) {
    const emailBody = `
Hey ${user.name}!

Thank you for signing up with your email ${
      user.email
    }. We have received your city as ${user.properties.get("city")}.

Team MathonGo.
        `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Welcome to MathonGo!",
      text: emailBody,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending email to ${user.email}:`, error);
    }
  }

  res.json({ message: "Emails sent" });
});

router.post("/unsubscribe/:email/:listId", async (req, res) => {
  const { email, listId } = req.params;
  try {
    await User.updateOne({ email, list: listId }, { unsubscribed: true });
    res.json({ message: "User unsubscribed" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
