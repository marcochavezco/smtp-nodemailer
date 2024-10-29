import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import { validateEmailOptions } from './lib/email.js';

export const app = express();
app.disable('x-powered-by');

app.use(express.json());
app.use(cors({ origin: '*', methods: ['POST'], preflightContinue: false }));

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/send', (req, res) => {
  const { from, to, subject, html } = req.body;
  console.log(req.body);

  const emailOptions = {
    from: from || null,
    to: to || null,
    subject: subject || null,
    html: html || null,
  };

  const send = async (emailOptions) => {
    try {
      const result = validateEmailOptions(emailOptions);

      if (!result.success) {
        res
          .status(400)
          .json({ status: 'error', message: 'Missing required fields' });
        throw new Error('Missing required fields');
      }

      const info = await transporter.sendMail(result.data);

      if (info.accepted.length === 0) {
        res
          .status(500)
          .json({ status: 'error', message: 'Failed to send email' });
        throw new Error('Failed to send email');
      }

      res.status(200).json({
        status: 'success',
        message: 'Email sent successfully',
        messageId: info.messageId,
      });

      console.log(info);
    } catch (error) {
      res
        .status(500)
        .json({ status: 'error', message: 'Something went wrong, try again.' });
      console.error(error);
    }
  };

  send(emailOptions);
});

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
