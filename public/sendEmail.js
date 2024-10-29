'use strict';

const poster = async (url, data) => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return Promise.reject('Failed to send email');
    }

    const result = await response.json();

    if (result.status === 'error') {
      throw new Error(result.message);
    }
    return result;
  } catch (error) {
    console.error(error);
  }
};

const sendEmail = async (emails, values) => {
  const { name, email, message } = values;

  const submission = {
    from: `Company Notifications <noreply@acme.com>`,
    to: emails.join(', '),
    subject: `New message from ${name}`,
    html: `
      <h1>New message from ${name}</h1>
      <p>${message}</p>
    `,
  };

  const reply = {
    from: `Company Notifications <noreply@acme.com>`,
    to: email,
    subject: `Thank you for contacting us!`,
    html: `
      <h1>Thank you for contacting us!</h1>
      <p>We will get back to you as soon as possible.</p>
    `,
  };

  try {
    const [submissionResult, replyResult] = await Promise.allSettled([
      poster('http://localhost:3000/send', submission),
      poster('http://localhost:3000/send', reply),
    ]);
    return [submissionResult, replyResult];
  } catch (error) {
    console.error(error);
  }
};

const emails = ['team@acme.com'];

const submitBtn = document.getElementById('submitBtn');

document
  .getElementById('contactForm')
  .addEventListener('submit', async (event) => {
    event.preventDefault();
    submitBtn.disabled = true;
    submitBtn.style['background-color'] = 'gray';

    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(data.entries());

    const [submissionResult, replyResult] = await sendEmail(emails, values);

    console.log('s', submissionResult, 'r', replyResult);

    if (
      submissionResult?.status !== 'fulfilled' ||
      replyResult?.status !== 'fulfilled'
    ) {
      submitBtn.style['background-color'] = '#fa8072';
      submitBtn.style['border'] = 'white';
      submitBtn.innerHTML = 'Try again';
      setTimeout(() => {
        submitBtn.innerHTML = 'Send';
        submitBtn.style['background-color'] = '#007BFF';
        submitBtn.style['border'] = 'white';
        submitBtn.disabled = false;
      }, 3000);
      return;
    }

    submitBtn.style['background-color'] = 'green';
    submitBtn.style['border'] = 'white';
  });
