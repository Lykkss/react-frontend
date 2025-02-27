import React from 'react';

function Contact() {
    return (
        <section className="bg-white">
            <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-gray-900">Contactez-nous</h2>
                <p className="mb-8 lg:mb-16 font-light text-center text-gray-800 dark:text-gray-600 sm:text-xl">Contactez-nous pour toute question ou demande d'information. Nous serons ravis de vous aider. </p>
                <form action="#" className="space-y-8"> 
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-500">Your email</label>
                        <input type="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-800 dark:placeholder-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="name@flowbite.com" required />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-500">Subject</label>
                        <input type="text" id="subject" className="block p-3 w-full text-sm text-gray-50 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:border-gray-800 dark:placeholder-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:shadow-sm-light" placeholder="Let us know how we can help you" required />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">Your message</label>
                        <textarea id="message" rows="6" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-white-700 dark:border-gray-800 dark:placeholder-gray-600 dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Leave a comment..." required></textarea>
                    </div>
                    <button type="submit" className="mt-8 inline-block rounded bg-gray-900 px-12 py-3 text-sm font-medium text-white transition  hover:bg-indigo-800  focus:outline-none focus:ring focus:ring-yellow-400"
                            >Submit</button>
                </form> 
            </div>
        </section>
    );
}

export default Contact;
