import axios from "axios";

const storageKey = 'auth-token';

export const api = axios.create({
	baseURL: 'http://localhost:3333',
});

api.interceptors.request.use(config => {
	const token = localStorage.getItem(storageKey);

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});