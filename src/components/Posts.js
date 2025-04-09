import React, { useEffect, useState } from 'react';
import wpApiSettings from '../config';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${wpApiSettings.baseUrl}/wp-json/wp/v2/posts`);
            if (!response.ok) {
                throw new Error(`Erreur ${response.status}: Impossible de récupérer les posts.`);
            }
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            setError(`Erreur de chargement des posts : ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) {
        return <div>Chargement des articles...</div>;
    }

    if (error) {
        return <div className="text-red-500">Erreur : {error}</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold sm:text-4xl text-center mb-8">Articles</h1>
            <ul className="list-none">
                {posts.map(post => (
                    <li key={post.id} className="p-4 border-b">
                        <h2 className="text-xl font-semibold">{post.title.rendered}</h2>
                        <p>{post.excerpt.rendered}</p>
                        <p><strong>Date de publication:</strong> {new Date(post.date).toLocaleDateString()}</p>
                        <a href={post.link} className="text-blue-600 hover:underline">Lire l'article</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Posts;
