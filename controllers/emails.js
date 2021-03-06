const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const key = require('../key.json');

const User = require('../db/models/User.js');

const router = express.Router();

// Identify if email is already in database
router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      // When this message is sent the client will know to throw an error.
      res.json({ message: 'The email does not exist' });
    }
    // Create and save password reset token
    const token = crypto.randomBytes(20).toString('hex');
    await user.updateOne({
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 360000,
    });
    // Send updated user data back to client
    res.json({
      userId: user._id,
      userFullName: user.userFullName,
      email: user.email,
      userName: user.userName,
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 360000,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Send password reset email
router.post('/send', async function(req, res, next) {
  const userData = req.body.data;

  // Just doing something silly
  let resetURL = 'http://localhost:3000/reset-password?=';
  if (userData.location !== 'http://localhost:8040') {
    resetURL = 'https://mealdig.com/reset-password/?=';
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      type: 'Oauth2',
      user: 'david@mealdig.com',
      serviceClient: key.client_id,
      privateKey: key.private_key,
    },
  });
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: 'noreply@mealdig.com',
      to: userData.email,
      subject: 'Reset your MealDig password.',
      // prettier-ignore
      html: 
			`<p><b>Hi ${userData.userFullName}</b></p>
			<p>You're receiving this email because you just requested to reset your password. Click on the link below to update your password now.</p>
			<a href='${resetURL}${userData.resetPasswordToken}'>Reset Here</a>`
    });
    res.send({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
  }
});

// Identify if password reset token is valid
router.post('/confirm-token', async (req, res) => {
  console.log(req.body.newPassword.token);
  console.log(req.body.newPassword.password);
  try {
    const user = await User.findOne({ resetPasswordToken: req.body.newPassword.token }).exec();
    if (!user) {
      res.json({ message: 'The user does not exist' });
    }
    const expiration = new Date(user.resetPasswordExpires).getTime();

    // Need to check the password reset token has not expired
    if (expiration > Date.now()) {
      // Update new password for user
      const password = bcrypt.hashSync(req.body.newPassword.password, 10);
      await user.updateOne({
        password,
      });
      res.json({
        userId: user._id,
        userFullName: user.userFullName,
        email: user.email,
        userName: user.userName,
      });
    }
    res.json({ message: 'This password reset link has expired' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Send confirm password changed email
router.post('/send-confirm', async function(req, res, next) {
  const userData = req.body.data;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      type: 'Oauth2',
      user: 'david@mealdig.com',
      serviceClient: key.client_id,
      privateKey: key.private_key,
    },
  });
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: 'noreply@mealdig.com',
      to: userData.email,
      subject: 'Success! Your password has been reset.',
      // prettier-ignore
      html: 
			 `<p><b>Hi ${userData.userFullName}</b></p>
			 <p>Your password has been succesfully reset.</p>
			 <a href='https://mealdig.com'>MealDig.com</a>`
    });
    res.send({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
  }
});

// Send feedback email
router.post('/send-feedback', async function(req, res, next) {
  console.log(req.body);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      type: 'Oauth2',
      user: 'david@mealdig.com',
      serviceClient: key.client_id,
      privateKey: key.private_key,
    },
  });
  try {
    await transporter.verify();
    await transporter.sendMail({
      from: 'noreply@mealdig.com',
      to: 'david@mealdig.com',
      subject: 'New Feedback Submitted',
      // prettier-ignore
      html: 
			  `<p><b>Hi David!</b></p>
			  <p>New Feedback Submitted</p>
			  <p>Submitted By: 
			  <br />${req.body.email}</p>
			  <p>Page URL:
			  <br/>${req.body.pageURL}</p>
			  <p>Message: 
			  <br />${req.body.emailMessage}</p>
			  <a href='https://mealdig.com'>MealDig.com</a>`
    });
    res.send({ message: 'Email sent' });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
