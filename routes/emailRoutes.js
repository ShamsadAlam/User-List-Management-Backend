const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const router = express.Router();

router.post("/send/:listId", async (req, res) => {
  const { subject, body } = req.body;
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
    let personalizedBody = body;
    for (const [key, value] of user.properties.entries()) {
      personalizedBody = personalizedBody.replace(`[${key}]`, value);
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      text: personalizedBody,
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
