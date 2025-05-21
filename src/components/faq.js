import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: 'Quels sont les horaires du festival ?',
      answer: 'Le festival commence à 10h00 et se termine à 23h00 chaque jour.',
    },
    {
      question: 'Puis-je acheter des billets sur place ?',
      answer: 'Oui, mais nous vous recommandons de les acheter en ligne à l’avance.',
    },
    {
      question: 'Quels types de nourriture sont disponibles ?',
      answer: 'Vous trouverez une variété de stands, y compris des options végétariennes et véganes.',
    },
    {
      question: 'Les enfants peuvent-ils venir au festival ?',
      answer: 'Oui, le festival est adapté aux familles, avec des espaces dédiés aux enfants.',
    },
    {
      question: 'Y a-t-il des restrictions sur les objets que je peux apporter ?',
      answer: 'Oui, les armes, les drogues et les objets dangereux sont interdits.',
    },
    {
      question: 'Comment puis-je contacter le service client ?',
      answer: 'Vous pouvez nous contacter par e-mail à contact&#64;liveevent.com ou par téléphone au 01 23 45 67 89.',
    },
    {
      question: 'Y a-t-il un parking disponible ?',
      answer: 'Oui, il y a plusieurs parkings à proximité du site du festival.',
    },
    {
      question: 'Le festival est-il accessible aux personnes à mobilité réduite ?',
      answer: 'Oui, le site est entièrement accessible aux personnes à mobilité réduite.',
    },
    {
      question: 'Où puis-je trouver le programme des artistes ?',
      answer: 'Le programme complet est disponible sur notre site web et à l’entrée du festival.',
    },
    {
      question: 'Y a-t-il des zones de recharge pour les téléphones ?',
      answer: 'Oui, nous avons des stations de recharge situées dans tout le festival.',
    },
    {
      question: 'Puis-je ramener ma propre nourriture et boisson ?',
      answer: 'Non, la nourriture et les boissons doivent être achetées sur place.',
    },
    {
      question: 'Y a-t-il des mesures de sécurité en place ?',
      answer: 'Oui, la sécurité est renforcée pour assurer la sécurité de tous les participants.',
    },
    {
      question: 'Comment puis-je devenir bénévole au festival ?',
      answer: 'Vous pouvez vous inscrire sur notre site web pour devenir bénévole.',
    },
    {
      question: 'Le festival est-il annulé en cas de pluie ?',
      answer: 'Non, le festival aura lieu même en cas de pluie. Des zones abritées seront disponibles.',
    }
  ];

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        {/* Titre principal */}
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 text-center">
          Foire aux Questions
        </h1>
        <p className="text-center text-black mb-12">
          Retrouvez ici les réponses aux questions les plus fréquentes.
        </p>

        {/* Liste accordéon */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white border border-black rounded-lg shadow-sm transition-shadow hover:shadow-md"
            >
              <summary className="cursor-pointer list-none px-6 py-4 flex justify-between items-center">
                <span className="font-semibold text-lg text-blue-600">
                  {faq.question}
                </span>
                <span className="ml-2 transform transition-transform group-open:rotate-45 text-black">
                  +
                </span>
              </summary>
              <div className="px-6 pb-4">
                <p className="text-black">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
