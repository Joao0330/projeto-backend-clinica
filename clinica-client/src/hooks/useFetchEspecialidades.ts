import { useEffect, useState } from 'react';
import { especialidades } from '../models/especialidades';
import { api } from '../lib/axios';

export const useFetchEspecialidades = () => {
	const [data, setData] = useState<especialidades[]>([]);

	useEffect(() => {
		async function fetchEspecialidades() {
			try {
				const response = await api.get('/especialidades');
				setData(response.data);
			} catch (err) {
				console.error(err);
			}
		}
		fetchEspecialidades();
	}, []);

	return { data };
};
