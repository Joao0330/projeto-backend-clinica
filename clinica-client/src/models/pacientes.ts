import { consultas } from "./consultas";
import { User } from "./user";

export interface pacientes{
    id: string,
    nome: string,
    contacto: string,
    morada: string,
    consultas: consultas,
    User: User
}