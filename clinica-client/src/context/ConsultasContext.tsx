/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from 'react';
import { consultas } from '../models/consultas';
import { api } from '../lib/axios';

interface ConsultasContextData {
	consultas: consultas[];
	getConsultas: () => Promise<void>;
	updateConsultas: (id_medico: string, id_consulta: string, updatedConsulta: Partial<consultas>) => Promise<void>;
	deleteConsultas: (id_medico: string, id_consulta: string) => Promise<void>;
	handleCreate: (idMedico: string, idEspecialidade: string, idPaciente: string, dataInicio: string, dataFim: string) => Promise<void>;
	handleUpdate: (id_medico: string, id_consulta: string, updatedConsulta: Partial<consultas>) => Promise<void>;
	handleDelete: (id_medico: string, id_consulta: string) => Promise<void>;
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

	const createConsultas = async (consultaData: { id_medico: string; id_especialidade: string; id_paciente: string; data_inicio: string; data_fim: string }) => {
		try {
			const { data } = await api.post('/consultas', consultaData);
			setConsultas(prev => [...prev, data]);
			alert('Consulta criada com sucesso!');
		} catch (err) {
			console.error('Erro ao criar consulta:', err);
			alert('Erro ao criar consulta.');
		}
	};

	const updateConsultas = async (id_medico: string, id_consulta: string, updatedConsulta: Partial<consultas>) => {
		try {
			const { data } = await api.put(`/consultas/${id_medico}/${id_consulta}`, updatedConsulta);
			setConsultas(prev => prev.map(consulta => (consulta.id_consulta === id_consulta ? data : consulta)));

			alert('Consulta editada com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao editar consulta.');
		}
	};

	const deleteConsultas = async (id_medico: string, id_consulta: string) => {
		try {
			await api.delete(`/consultas/${id_medico}/${id_consulta}`);
			setConsultas(prev => prev.filter(consulta => consulta.id_consulta !== id_consulta));

			alert('Consulta apagada com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao apagar consulta.');
		}
	};

	const handleCreate = async (idMedico: string, idEspecialidade: string, idPaciente: string, dataInicio: string, dataFim: string) => {
		try {
			await createConsultas({
				id_medico: idMedico,
				id_especialidade: idEspecialidade,
				id_paciente: idPaciente,
				data_inicio: dataInicio,
				data_fim: dataFim,
			});
			await getConsultas();
		} catch (err) {
			console.error('Erro ao criar consulta:', err);
		}
	};

	const handleUpdate = async (id_medico: string, id_consulta: string, updatedConsulta: Partial<consultas>) => {
		try {
			await updateConsultas(id_medico, id_consulta, updatedConsulta);

			await getConsultas();
		} catch(err){
			console.error("Erro ao editar consulta:", err)
		}
	}

	const handleDelete = async (id_medico: string, id_consulta: string) => {
		try{
			await deleteConsultas(id_medico, id_consulta)
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<ConsultasContext.Provider
			value={{
				consultas,
				getConsultas,
				updateConsultas,
				deleteConsultas,
				handleCreate,
				handleUpdate,
				handleDelete,
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
