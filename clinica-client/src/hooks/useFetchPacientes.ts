import { useState, useEffect } from 'react';
import { api } from '../lib/axios';
import { pacientes } from '../models/pacientes';

export const useFetchPacientes = () => {
	const [data, setData] = useState<pacientes[]>([]);

	useEffect(() => {
		async function fetchPacientes() {
			try {
				const response = await api.get('/pacientes');
				setData(response.data);
			} catch (err) {
				console.error(err)
			}
		}
		fetchPacientes();
	}, []);

	return { data };
};
