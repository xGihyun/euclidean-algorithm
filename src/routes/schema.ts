import { z } from "zod";

export const formSchema = z.object({
	num1: z.number().positive().int().optional(),
	num2: z.number().positive().int().optional(),
});

export type FormSchema = typeof formSchema;
