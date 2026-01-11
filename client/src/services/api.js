import axios from 'axios';
import toast from 'react-hot-toast';
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

//Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.data.message) {
            toast.error(error.response.data.message, {
                duration: 3000,
                position: 'bottom-right',
                icon: '⚠️',
            })
        }
        return Promise.reject(error);
    }
);

// AUTH ENDPOINTS
export const authApi = {
    login: (data) => api.post('/auth/login', data),
}


export default api; 