import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import "./cont.css";

const Contact = () => {
  const form = useRef();
  const [messageSent, setMessageSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setMessageSent(false);
    setErrorMessage('');

    try {
      emailjs
        .sendForm('service_hqwmygt', 'template_2fy1stc', form.current, {
          publicKey: 'F3ArwgZ_UZ5nVSmEm',
        })
        .then(
          () => {
            console.log('SUCCESS!');
            setMessageSent(true);
            form.current.reset(); // Clear the form fields
          },
          (error) => {
            console.log('FAILED...', error.text);
            setErrorMessage('Failed to send message. Please try again later.');
          },
        );
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };
  return (
    <div className="contact-us">
      <section className="contact-header">
        <div className="header-background"></div>
        <div className="header-content">
          <h1>
            Contact <span>Us</span>
          </h1>
          <p>Speak with us about our seamless communication and global impact.</p>
        </div>
      </section>

      <main className="contact-main">
        <div className="contact-info">
          <h2>Get in touch</h2>
          <h3>Seamless Communication, Global Impact.</h3>
          <p>
            We look forward to hearing from you! We can assist with inquiries about our offerings,
            project discussions, or even just providing guidance on your digital strategy.
          </p>
        </div>

        <div className="contact-form">
          <h2>Send us a message</h2>
          <p>Please feel free to send us any questions, feedback, or suggestions you might have.</p>
          <form ref={form} onSubmit={sendEmail}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">NAME</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  name="form_name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  name="from_email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">YOUR MESSAGE</label>
              <textarea
                id="message"
                rows="4"
                placeholder="Your Message"
                name="message"
              ></textarea>
            </div>

            <button type="submit" value="Send">Submit</button>
          </form>
          {messageSent && <p className="success-message">Your response has been sent to the admin!</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </main>
    </div>
  );
};

export default Contact;
