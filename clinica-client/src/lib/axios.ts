import axios from 'axios';

const storageKey = 'auth-token';

export const api = axios.create({
	baseURL: 'https://projeto-backend-clinica.onrender.com',
});

api.interceptors.request.use(config => {
	const token = localStorage.getItem(storageKey);

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});
