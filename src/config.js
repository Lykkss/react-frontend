const wpApiSettings = window.wpApiSettings || {
    baseUrl: process.env.NEXT_PUBLIC_WP_API_URL || '',
};

export default wpApiSettings;
