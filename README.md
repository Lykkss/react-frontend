React WordPress Project
This project integrates a ReactJS frontend with a WordPress backend, aiming to provide a seamless and dynamic user experience by leveraging the strengths of both technologies — a modern UI with React and powerful content management with WordPress.

📚 Table of Contents
Overview

Technologies Used

Architecture

Installation

1. Install WordPress

2. Set Up ReactJS

3. Connect React with WordPress

Usage

Features

Example: Fetching Posts

Dependencies

Contributing

License

🔍 Overview
This is a full-stack web application that combines:

A ReactJS-based frontend for rendering dynamic and responsive user interfaces.

A WordPress-based backend used as a headless CMS, exposing content via REST API.

⚙️ Technologies Used
ReactJS: 18.3.1

WordPress: 6.3

phpMyAdmin: 5.2.1

MySQL: 8.0

Tailwind CSS, Axios, React Router, and more.

🏗️ Architecture
🔹 ReactJS Directory Structure
pgsql
Copy
Edit
react-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Posts.js
│   ├── App.js
│   ├── index.js
│   └── styles/
│       └── App.css
├── package.json
└── README.md
🔸 WordPress Directory Structure
arduino
Copy
Edit
wordpress/
├── wp-content/
│   ├── themes/
│   │   └── react-theme/
│   │       ├── functions.php
│   │       ├── style.css
│   │       └── build/ (React build files)
│   ├── plugins/
├── wp-config.php
└── .htaccess
🛠️ Installation
✅ Prerequisites
Make sure you have:

Node.js (v18+)

npm

PHP (v8+)

MySQL

Web server (e.g., XAMPP, WAMP, MAMP)

1️⃣ Install WordPress
Download WordPress from wordpress.org.

Extract it into your server directory, e.g., /var/www/html/wordpress.

Create a MySQL database:

sql
Copy
Edit
CREATE DATABASE wordpress;
CREATE USER 'wp_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON wordpress.* TO 'wp_user'@'localhost';
FLUSH PRIVILEGES;
Configure wp-config.php with your DB credentials.

Visit http://localhost/wordpress to complete the installation.

2️⃣ Set Up ReactJS
Clone the repository:

bash
Copy
Edit
git clone git@github.com:Lykkss/react-frontend.git
cd react-wordpress-project/react-frontend
Install dependencies:

bash
Copy
Edit
npm install
(Optional) Install extra tools:

bash
Copy
Edit
npm install axios @react-google-maps/api @vis.gl/react-google-maps react-cookie-consent react-icons react-router-dom tailwindcss autoprefixer postcss
3️⃣ Connect React with WordPress
Build the React app:

bash
Copy
Edit
npm run build
Copy the build/ folder into your WordPress theme:

bash
Copy
Edit
cp -r build/ /var/www/html/wordpress/wp-content/themes/react-theme/
In functions.php of your theme:

php
Copy
Edit
function enqueue_react_app() {
    wp_enqueue_script('react-app', get_template_directory_uri() . '/build/static/js/main.js', array(), null, true);
    wp_enqueue_style('react-app', get_template_directory_uri() . '/build/static/css/main.css', array(), null, 'all');
}
add_action('wp_enqueue_scripts', 'enqueue_react_app');
Activate the react-theme in the WordPress admin panel.

🚀 Usage
To start the development server (for React only):

bash
Copy
Edit
npm start
Visit: http://localhost:3000

✨ Features
React Frontend: Clean, responsive UI.

WordPress Backend: Full CMS for managing content.

REST API: Real-time data fetching.

Component-Based: Modular React codebase.

Custom Styling: TailwindCSS and custom themes.

📦 Example: Fetching Posts
jsx
Copy
Edit
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('http://localhost/wordpress/wp-json/wp/v2/posts')
            .then(res => setPosts(res.data))
            .catch(err => console.error('Error:', err));
    }, []);

    return (
        <div>
            <h1>Posts</h1>
            <ul>
                {posts.map(post => (
                    <li key={post.id}>{post.title.rendered}</li>
                ))}
            </ul>
        </div>
    );
};

export default Posts;
📁 Dependencies
React
react: ^18.3.1

axios: ^1.7.7

react-router-dom: ^6.26.1

tailwindcss: ^3.4.10

react-icons, react-cookie-consent, @react-google-maps/api, etc.

Dev
jest: ^27.5.1

autoprefixer: ^10.4.20

postcss: ^8.4.45

🤝 Contributing
Contributions are welcome!
Please fork the repository and submit a pull request with your changes.

📄 License
This project is licensed under the MIT License.
See the LICENSE file for details.

