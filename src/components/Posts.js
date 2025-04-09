// src/components/post.js
import React, { useState } from "react";
import config from "../config";

const PostConcert = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    start_date: "",
    end_date: "",
    lieu_id: "",
    organisateur_id: "",
    categorie_id: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${config.baseUrl}/concerts/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // En production, pensez à ajouter l'Authorization avec le token si nécessaire
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMessage("Concert créé avec succès !");
      console.log("Concert créé :", data);
    } catch (err) {
      console.error("Erreur lors de la création du concert :", err);
      setMessage("Erreur lors de la création du concert.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" onChange={handleChange} placeholder="Titre" />
      <textarea name="description" onChange={handleChange} placeholder="Description" />
      <input name="price" onChange={handleChange} placeholder="Prix" />
      <input name="start_date" type="datetime-local" onChange={handleChange} />
      <input name="end_date" type="datetime-local" onChange={handleChange} />
      <input name="lieu_id" onChange={handleChange} placeholder="ID du lieu" />
      <input name="organisateur_id" onChange={handleChange} placeholder="ID de l'organisateur" />
      <input name="categorie_id" onChange={handleChange} placeholder="ID de la catégorie" />
      <button type="submit">Créer Concert</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default PostConcert;
