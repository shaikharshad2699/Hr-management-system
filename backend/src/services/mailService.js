const nodemailer = require('nodemailer');

class MailService {
  createTransporter() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      throw new Error('SMTP configuration is missing. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.');
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
    });
  }

  async sendTemplateEmail({ to, subject, html, text }) {
    const transporter = this.createTransporter();
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;

    return transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
  }
}

module.exports = new MailService();
