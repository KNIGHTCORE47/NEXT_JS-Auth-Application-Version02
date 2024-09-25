import { z as zod } from 'zod'

export const logInSchema = zod
    .object({
        email: zod.string(),
        password: zod.string()
    })