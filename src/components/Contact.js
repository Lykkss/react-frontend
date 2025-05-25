import React, { useState } from 'react';

function Contact() {
  const [form, setForm] = useState({ email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const payload = {
      email: form.email,
      subject: form.subject,
      message: form.message,
      _replyto: form.email,
      _subject: `Contact form: ${form.subject}`,
    };

    try {
      const res = await fetch('https://formspree.io/f/xwpodozb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus('success');
        setForm({ email: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="bg-white">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2
          id="contact-title"
          className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900"
        >
          Contactez-nous
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 sm:text-xl">
          Une question ? Un retour à nous faire ? Dites-nous tout.
        </p>

        <form
          onSubmit={handleSubmit}
          aria-labelledby="contact-title"
          className="space-y-8"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Votre e-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="exemple@contact.com"
              className="bg-white border border-indigo-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block w-full p-2.5 rounded-lg text-sm text-gray-900 transition"
            />
          </div>

          {/* Sujet */}
          <div>
            <label
              htmlFor="subject"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Sujet
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="Let us know how we can help you"
              className="bg-white border border-indigo-950  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block w-full p-3 rounded-lg text-sm text-gray-900 transition"
            />
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Votre message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={form.message}
              onChange={handleChange}
              required
              placeholder="Leave a comment..."
              className="bg-white border border-indigo-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 block w-full p-2.5 rounded-lg text-sm text-gray-900 transition"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="inline-block rounded bg-indigo-950 hover:bg-blue-700 text-white font-medium px-8 py-3 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {status === 'loading' ? 'Envoi…' : 'Envoyer'}
          </button>

          {status === 'success' && (
            <p className="mt-4 text-green-600">
              Message envoyé ! Merci.
            </p>
          )}
          {status === 'error' && (
            <p className="mt-4 text-red-600">
              Erreur d’envoi, veuillez réessayer.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;