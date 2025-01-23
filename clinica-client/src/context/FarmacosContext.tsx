/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from 'react';
import { farmacos } from '../models/farmacos';
import { api } from '../lib/axios';

interface FarmacosContextData {
	farmacos: farmacos[];
	handleCreate: (nome: string) => Promise<void>;
	handleUpdate: (id_farmaco: string, updatedFarmaco: Partial<farmacos>) => Promise<void>;
	handleDelete: (id_farmaco: string) => Promise<void>;
}

interface FarmacosProviderProps {
	children: ReactNode;
}

const FarmacosContext = createContext({} as FarmacosContextData);

export function FarmacosProvider({ children }: FarmacosProviderProps) {
	const [farmacos, setFarmacos] = useState<farmacos[]>([]);

	const createFarmacos = async (FarmacoData: { nome: string }) => {
		try {
			const { data } = await api.post('/farmacos', FarmacoData);
			setFarmacos(prev => [...prev, data]);
			alert('Fármaco criado com sucesso!');
		} catch (err) {
			console.error('Erro ao criar fármaco:', err);
			alert('Erro ao criar fármaco.');
		}
	};

	const updateFarmacos = async (id_farmaco: string, updatedFarmaco: Partial<farmacos>) => {
		try {
			const { data } = await api.put(`/farmacos/${id_farmaco}`, updatedFarmaco);
			setFarmacos(prev => prev.map(farmaco => (farmaco.id === id_farmaco ? data : farmaco)));

			alert('Fármaco editado com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao editar fármaco.');
		}
	};

	const deleteFarmacos = async (id_farmaco: string) => {
		try {
			await api.delete(`/farmacos/${id_farmaco}`);
			setFarmacos(prev => prev.filter(farmaco => farmaco.id !== id_farmaco));

			alert('Fármaco apagado com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao apagar fármaco.');
		}
	};

	const handleCreate = async (nome: string) => {
		try {
			await createFarmacos({
				nome: nome,
			});
		} catch (err) {
			console.error('Erro ao criar Fármaco:', err);
		}
	};

	const handleUpdate = async (id_farmaco: string, updatedFarmaco: Partial<farmacos>) => {
		try {
			await updateFarmacos(id_farmaco, updatedFarmaco);
		} catch (err) {
			console.error('Erro ao editar fármaco:', err);
		}
	};

	const handleDelete = async (id_farmaco: string) => {
		try {
			await deleteFarmacos(id_farmaco);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<FarmacosContext.Provider
			value={{
				farmacos,
				handleCreate,
				handleUpdate,
				handleDelete,
			}}
		>
			{children}
		</FarmacosContext.Provider>
	);
}

export function useFarmacos() {
	const context = useContext(FarmacosContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
