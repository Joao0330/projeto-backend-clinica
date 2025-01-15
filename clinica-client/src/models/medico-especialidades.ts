import { especialidades } from './especialidades';
import { medicos } from './medicos';

export interface medicoEspecialidades {
	id_medico: string;
	id_especialidade: string;
	medico: medicos;
	especialidade: especialidades;
}
