import { z } from "zod";

export const createRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const createLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})