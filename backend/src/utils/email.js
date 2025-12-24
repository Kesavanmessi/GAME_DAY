const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');
const logger = require('./logger');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(' ')[0] : 'User';
    this.url = url;
    this.from = `GameDay <${process.env.EMAIL_FROM}>`;
  }

  // Create a transporter
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SendGrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    // Mailtrap for development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  // Send the actual email
  async send(template, subject) {
    try {
      // 1) Render HTML based on a pug template
      const html = pug.renderFile(
        `${__dirname}/../views/emails/${template}.pug`,
        {
          firstName: this.firstName,
          url: this.url,
          subject
        }
      );

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: convert(html, { wordwrap: 130 })
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      logger.error(`Failed to send email to ${this.to}: ${err.message}`);
      throw new Error('There was an error sending the email. Try again later!');
    }
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to GameDay!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }

  async sendEmailVerification() {
    await this.send(
      'emailVerification',
      'Verify your email address (valid for 24 hours)'
    );
  }

  async sendMatchReminder(matchDetails) {
    try {
      const html = pug.renderFile(
        `${__dirname}/../views/emails/matchReminder.pug`,
        {
          firstName: this.firstName,
          matchDetails,
          subject: 'Upcoming Match Reminder'
        }
      );

      const mailOptions = {
        from: this.from,
        to: this.to,
        subject: 'Upcoming Match Reminder',
        html,
        text: convert(html, { wordwrap: 130 })
      };

      await this.newTransport().sendMail(mailOptions);
    } catch (err) {
      logger.error(`Failed to send match reminder to ${this.to}: ${err.message}`);
    }
  }
}

module.exports = Email;
