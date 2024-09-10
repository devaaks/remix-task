import { z } from 'zod';

export const UsersSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").max(100, "Name is too long"),
    height: z.string().regex(/^\d+$/, "Height must be a numeric string"),
    mass: z.string().regex(/^\d+$/, "Mass must be a numeric string"),
    gender: z.enum(["male", "female", "unknown", "n/a"]),
    birth_year: z.string(),
    hair_color: z.string().min(1, "Hair color cannot be empty").max(50, "Hair color is too long"),
}).array();
