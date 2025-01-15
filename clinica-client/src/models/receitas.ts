import { consultas } from "./consultas";
import { farmacos } from "./farmacos";

export interface receitas{
    id_consulta_medico: string,
    id_consulta: string,
    id_farmaco: string,
    data_receita: Date,
    consulta: consultas,
    farmaco: farmacos
}