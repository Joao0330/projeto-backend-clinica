import { consultas } from './consultas';
import { medicoEspecialidades } from './medico-especialidades';

export interface especialidades {
	id: string;
	designacao: string;
	consultas: consultas;
	medicoEspecialidades: medicoEspecialidades;
}
