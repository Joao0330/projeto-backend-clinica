import { FastifyInstance } from "fastify";
import { createEspecialidade, deleteEspecialidade, getAllEspecialidades, getEspecialidade, updateEspecialidade } from "./especialidades.controller";

export async function especialidadesRoutes(app: FastifyInstance) {
    app.get('/especialidades', getAllEspecialidades);

    app.get("/especialidades/:id", getEspecialidade);

    app.post("/especialidades", createEspecialidade);

    app.put("/especialidades/:id", updateEspecialidade);

    app.delete("/especialidades/:id", deleteEspecialidade);
}