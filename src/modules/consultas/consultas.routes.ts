import { FastifyInstance } from "fastify";
import { createConsulta, deleteConsulta, getAllConsultas, getConsulta, updateConsulta } from "./consultas.controller";

export async function consultasRoutes(app: FastifyInstance) {
    app.get("/consultas", getAllConsultas);

    app.get("/consultas/:id_medico/:numero_consulta", getConsulta);

    app.post("/consultas", createConsulta);

    app.put("/consultas/:id_medico/:numero_consulta", updateConsulta);

    app.delete("/consultas/:id_medico/:numero_consulta", deleteConsulta);
}