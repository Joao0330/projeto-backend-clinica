/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from 'react';
import { pacientes } from '../models/pacientes';
import { api } from '../lib/axios';

interface PacientesContextData {
	pacientes: pacientes[];
	handleCreate: (nome: string, contacto: string, morada: string, email: string, password: string) => Promise<void>;
	handleUpdate: (id_medico: string, updatedMedico: Partial<pacientes>) => Promise<void>;
	handleDelete: (id_medico: string) => Promise<void>;
}

interface PacientesProviderProps {
	children: ReactNode;
}

const PacientesContext = createContext({} as PacientesContextData);

export function PacientesProvider({ children }: PacientesProviderProps) {
	const [pacientes, setPacientes] = useState<pacientes[]>([]);

	const createPacientes = async (PacienteData: { nome: string; contacto: string; morada: string; email: string; password: string }) => {
		try {
			const { data } = await api.post('/pacientes', PacienteData);
			setPacientes(prev => [...prev, data]);
			alert('Paciente criado com sucesso!');
		} catch (err) {
			console.error('Erro ao criar Paciente:', err);
			alert('Erro ao criar Médico.');
		}
	};

	const updatePacientes = async (id_paciente: string, updatedPaciente: Partial<pacientes>) => {
		try {
			const { data } = await api.put(`/pacientes/${id_paciente}`, updatedPaciente);
			setPacientes(prev => prev.map(paciente => (paciente.id === id_paciente ? data : paciente)));

			alert('Paciente editado com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao editar paciente.');
		}
	};

	const deletePacientes = async (id_paciente: string) => {
		try {
			await api.delete(`/pacientes/${id_paciente}`);
			setPacientes(prev => prev.filter(paciente => paciente.id !== id_paciente));

			alert('Paciente apagado com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao apagar paciente.');
		}
	};

	const handleCreate = async (nome: string, contacto: string, morada: string, email: string, password: string) => {
		try {
			await createPacientes({
				nome: nome,
				contacto: contacto,
				morada: morada,
				email: email,
				password: password,
			});
		} catch (err) {
			console.error('Erro ao criar Paciente:', err);
		}
	};

	const handleUpdate = async (id_paciente: string, updatedPaciente: Partial<pacientes>) => {
		try {
			await updatePacientes(id_paciente, updatedPaciente);
		} catch (err) {
			console.error('Erro ao editar paciente:', err);
		}
	};

	const handleDelete = async (id_paciente: string) => {
		try {
			await deletePacientes(id_paciente);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<PacientesContext.Provider
			value={{
				pacientes,
				handleCreate,
				handleUpdate,
				handleDelete,
			}}
		>
			{children}
		</PacientesContext.Provider>
	);
}

export function usePacientes() {
	const context = useContext(PacientesContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
