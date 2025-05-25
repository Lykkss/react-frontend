import React from 'react';

function Contact() {
  return (
    <section className="bg-white">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2
          id="contact-title"
          className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900"
        >
          Contactez-nous
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-gray-800 sm:text-xl">
          Contactez-nous pour toute question ou demande d'information. Nous
          serons ravis de vous aider.
        </p>

        <form
          action="#"
          aria-labelledby="contact-title"
          className="space-y-8"
        >
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
              aria-required="true"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 block w-full p-2.5"
              placeholder="name@flowbite.com"
              required
            />
          </div>

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
              aria-required="true"
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              placeholder="Let us know how we can help you"
              required
            />
          </div>

          <div>
            <label
              htmlFor="message"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Votre message
            </label>
            <textarea
              id="message"
              rows="6"
              aria-required="true"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              placeholder="Leave a comment..."
              required
            ></textarea>
          </div>

          <button
            type="submit"
            aria-label="Envoyer le formulaire de contact"
            className="mt-8 inline-block rounded bg-gray-900 px-12 py-3 text-sm font-medium text-white transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}

export default Contact;
