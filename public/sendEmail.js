'use strict';

const emails = ['marcochavezco@outlook.com'];

const sendEmail = async (emails, values) => {
  const { name, email, message } = values;

  const emailOptions = {
    from: `Company Notifications <noreply@acme.com>`,
    to: emails.join(', '),
    subject: `New message from ${name}`,
    html: `
      <h1>New message from ${name}</h1>
      <p>${message}</p>
    `,
  };

  try {
    const response = await fetch('http://localhost:3000/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailOptions),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    const result = await response.json();

    if (result.status === 'error') {
      throw new Error(result.message);
    }

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const submitBtn = document.getElementById('submitBtn');

document.getElementById('contactForm').addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(event.currentTarget);
  const values = Object.fromEntries(data.entries());

  sendEmail(emails, values);
  submitBtn.style['background-color'] = 'green';
  submitBtn.style['border'] = 'white';
});
