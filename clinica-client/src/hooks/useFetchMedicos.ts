import { useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { medicos } from '../models/medicos';

export const useFetchMedicos = () => {
	const [data, setData] = useState<medicos[]>([]);

	useEffect(() => {
		async function fetchMedicos() {
			try {
				const response = await api.get('/medicos');
				setData(response.data);
			} catch (err) {
				console.error(err);
			}
		}
		fetchMedicos();
	}, []);

	return { data };
};
