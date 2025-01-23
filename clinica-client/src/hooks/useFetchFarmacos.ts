import { useEffect, useState } from 'react';
import { farmacos } from '../models/farmacos';
import { api } from '../lib/axios';

export const useFetchFarmacos = () => {
	const [data, setData] = useState<farmacos[]>([]);

	useEffect(() => {
		async function fetchFarmacos() {
			try {
				const response = await api.get('/farmacos');
				setData(response.data);
			} catch (err) {
				console.error(err);
			}
		}
		fetchFarmacos();
	}, []);

	return { data };
};
