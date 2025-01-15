import { especialidades } from "./especialidades";
import { medicos } from "./medicos";
import { pacientes } from "./pacientes";
import { receitas } from "./receitas";

export interface consultas{
    id_medico: string,
    id_consulta: string,
    id_especialidade: string,
    id_paciente: string,
    data_inicio: Date,
    data_fim: Date,
    medico: medicos,
    paciente: pacientes,
    especialidade: especialidades,
    receita: receitas
}