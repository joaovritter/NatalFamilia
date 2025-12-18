import axios from 'axios';

const api = axios.create({
    baseURL: 'http://3.143.252.42:3000/api',
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;
