import { FastifyInstance } from "fastify";
import { loginUser, registerUser } from "./auth.controller";

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", registerUser);

    app.post("/login", loginUser);
}