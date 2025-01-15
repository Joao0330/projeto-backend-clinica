import { medicos } from './medicos';
import { pacientes } from './pacientes';

export interface User {
	id: string;
	nome?: string | null;
	email: string;
	role: 'ADMIN' | 'MEDICO' | 'UTENTE';
	pacienteId?: string | null;
	medicoId?: string | null;
	createdAt: Date;
	updatedAt: Date;
	medico: medicos;
	paciente: pacientes;
}
