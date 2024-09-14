import axios from 'axios';

const api = axios.create({
    baseURL: 'https://demo1-ldvt.onrender.com', 
});

export default api;
