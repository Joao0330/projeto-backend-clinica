/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from 'react';
import { medicos } from '../models/medicos';
import { api } from '../lib/axios';

interface MedicosContextData {
	medicos: medicos[];
	handleCreate: (nome: string, contacto: string, morada: string, email: string, password: string) => Promise<void>;
	handleUpdate: (id_medico: string, updatedMedico: Partial<medicos>) => Promise<void>;
	handleDelete: (id_medico: string) => Promise<void>;
}

interface MedicosProviderProps {
	children: ReactNode;
}

const MedicosContext = createContext({} as MedicosContextData);

export function MedicosProvider({ children }: MedicosProviderProps) {
	const [medicos, setMedicos] = useState<medicos[]>([]);

	const createMedicos = async (MedicoData: { nome: string; contacto: string; morada: string; email: string; password: string }) => {
		try {
			const { data } = await api.post('/medicos', MedicoData);
			setMedicos(prev => [...prev, data]);
			alert('Médico criado com sucesso!');
		} catch (err) {
			console.error('Erro ao criar Médico:', err);
			alert('Erro ao criar Médico.');
		}
	};

	const updateMedicos = async (id_medico: string, updatedMedico: Partial<medicos>) => {
		try {
			const { data } = await api.put(`/medicos/${id_medico}`, updatedMedico);
			setMedicos(prev => prev.map(medico => (medico.id === id_medico ? data : medico)));

			alert('Médico editado com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao editar médico.');
		}
	};

	const deleteMedicos = async (id_medico: string) => {
		try {
			await api.delete(`/medicos/${id_medico}`);
			setMedicos(prev => prev.filter(medico => medico.id !== id_medico));

			alert('Médico apagado com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao apagar médico.');
		}
	};

	const handleCreate = async (nome: string, contacto: string, morada: string, email: string, password: string) => {
		try {
			await createMedicos({
				nome: nome,
				contacto: contacto,
				morada: morada,
				email: email,
				password: password,
			});
		} catch (err) {
			console.error('Erro ao criar Médico:', err);
		}
	};

	const handleUpdate = async (id_medico: string, updatedMedico: Partial<medicos>) => {
		try {
			await updateMedicos(id_medico, updatedMedico);
		} catch (err) {
			console.error('Erro ao editar consulta:', err);
		}
	};

	const handleDelete = async (id_medico: string) => {
		try {
			await deleteMedicos(id_medico);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<MedicosContext.Provider
			value={{
				medicos,
				handleCreate,
				handleUpdate,
				handleDelete,
			}}
		>
			{children}
		</MedicosContext.Provider>
	);
}

export function useMedicos() {
	const context = useContext(MedicosContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
