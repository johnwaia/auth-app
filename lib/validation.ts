import { z } from 'zod';


export const signUpSchema = z.object({
firstName: z.string().min(2, 'Trop court'),
lastName: z.string().min(2, 'Trop court'),
email: z.string().email('Email invalide'),
phone: z.string().min(8, 'Téléphone invalide'),
password: z.string().min(6, 'Min 6 caractères'),
});


export const signInSchema = z.object({
email: z.string().email('Email invalide'),
password: z.string().min(6, 'Min 6 caractères'),
});


export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;