import { z as zod } from 'zod'

export const forgotPasswordSchema = zod
    .object({
        email: zod.string(),
        password: zod.string(),
        confirmPassword: zod.string()
    })