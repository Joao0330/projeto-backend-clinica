/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from 'react';
import { consultas } from '../models/consultas';
import { api } from '../lib/axios';

interface ConsultasContextData {
	consultas: consultas[];
	getConsultas: () => Promise<void>;
	createConsultas: () => Promise<void>;
}

interface ConsultasProviderProps {
	children: ReactNode;
}

const ConsultasContext = createContext({} as ConsultasContextData);

export function ConsultasProvider({ children }: ConsultasProviderProps) {
	const [consultas, setConsultas] = useState<consultas[]>([]);

	const getConsultas = async () => {
		try {
			const { data } = await api.get('/consultas');
			setConsultas(data);
		} catch (err) {
			console.error(err);
		}
	};

	const createConsultas = async () => {
		try {
			const { data } = await api.post("/consultas");
			setConsultas((prev) => [...prev, data]);

		} catch (err) {
			console.error(err);
		}
	};

	return (
		<ConsultasContext.Provider
			value={{
				consultas,
				getConsultas,
				createConsultas,
			}}
		>
			{children}
		</ConsultasContext.Provider>
	);
}

export function useConsultas() {
	const context = useContext(ConsultasContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
