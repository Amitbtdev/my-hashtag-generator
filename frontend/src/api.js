import axios from 'axios';

const api = axios.create({
    baseURL: 'https://my-hashtag-generator.onrender.com/',
});

export default api;
