import { z as zod } from 'zod'

export const signUpSchema = zod
    .object({
        username: zod
            .string()
            .min(3, 'Username must be at least 3 characters long')
            .max(20, 'Username must be at most 20 characters long')
            .regex(/^[a-zA-Z0-9]+$/, 'Username can only contain uppercase, lowercase letters and numbers'),
        email: zod
            .string()
            .email('Invalid email')
            .min(3, 'Email must be at least 3 characters long')
            .max(50, 'Email must be at most 50 characters long')
            .regex(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email'),
        password: zod
            .string()
            .min(6, 'Password must be at least 6 characters long')
            .max(18, 'Password must be at most 18 characters long')
    })