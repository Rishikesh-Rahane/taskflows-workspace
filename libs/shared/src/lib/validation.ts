import z from 'zod';

// Define a Zod schema for validating user input
export const userSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
})
