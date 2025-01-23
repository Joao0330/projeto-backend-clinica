/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useContext, useState } from "react";
import { especialidades } from "../models/especialidades";
import { api } from "../lib/axios";

interface EspecialidadesContextData {
    especialidades: especialidades[];
    handleCreate: (designacao: string) => Promise<void>;
    handleUpdate: (id_especialidade: string, updatedEspecialidade: Partial<especialidades>) => Promise<void>;
    handleDelete: (id_especialidade: string) => Promise<void>;
}

interface EspecialidadesProviderProps {
	children: ReactNode;
}

const EspecialidadesContext = createContext({} as EspecialidadesContextData);

export function EspecialidadesProvider({ children }: EspecialidadesProviderProps) {
	const [especialidades, setEspecialidades] = useState<especialidades[]>([]);

	const createEspecialidades = async (EspecialidadeData: { designacao: string }) => {
		try {
			const { data } = await api.post('/especialidades', EspecialidadeData);
			setEspecialidades(prev => [...prev, data]);
			alert('Especialidade criada com sucesso!');
		} catch (err) {
			console.error('Erro ao criar especialidade:', err);
			alert('Erro ao criar especialidade.');
		}
	};

	const updateEspecialidades= async (id_especialidade: string, updatedEspecialidade: Partial<especialidades>) => {
		try {
			const { data } = await api.put(`/especialidades/${id_especialidade}`, updatedEspecialidade);
			setEspecialidades(prev => prev.map(especialidade => (especialidade.id === id_especialidade ? data : especialidade)));

			alert('Especialidade editada com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao editar especialidade.');
		}
	};

	const deleteEspecialidades = async (id_especialidade: string) => {
		try {
			await api.delete(`/especialidades/${id_especialidade}`);
			setEspecialidades(prev => prev.filter(especialidade => especialidade.id !== id_especialidade));

			alert('Especialidade apagada com sucesso!');
		} catch (err) {
			console.error(err);
			alert('Erro ao apagar especialidade.');
		}
	};

	const handleCreate = async (designacao: string) => {
		try {
			await createEspecialidades({
				designacao: designacao,
			});
		} catch (err) {
			console.error('Erro ao criar especialidade:', err);
		}
	};

	const handleUpdate = async (id_especialidade: string, updatedEspecialidade: Partial<especialidades>) => {
		try {
			await updateEspecialidades(id_especialidade, updatedEspecialidade);
		} catch (err) {
			console.error('Erro ao editar especialidade:', err);
		}
	};

	const handleDelete = async (id_especialidade: string) => {
		try {
			await deleteEspecialidades(id_especialidade);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<EspecialidadesContext.Provider
			value={{
				especialidades,
				handleCreate,
				handleUpdate,
				handleDelete,
			}}
		>
			{children}
		</EspecialidadesContext.Provider>
	);
}

export function useEspecialidades() {
    const context = useContext(EspecialidadesContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}