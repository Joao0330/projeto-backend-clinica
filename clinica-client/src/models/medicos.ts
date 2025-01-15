import { consultas } from './consultas';
import { medicoEspecialidades } from './medico-especialidades';
import { User } from './user';

export interface medicos {
	id: string;
	nome: string;
	contacto: string;
	morada: string;
	numero_empregado: number;
	User: User;
	consultas: consultas;
	especialidades: medicoEspecialidades;
}
