import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // your Django API
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDesigns = () => api.get('/designs/');
export const saveDesign = (payload: any) => api.post('/designs/', payload);

export default api;





