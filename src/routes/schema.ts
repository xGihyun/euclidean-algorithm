import { z } from "zod";

export const formSchema = z.object({
	num1: z.string().refine((v) => v !== "" && Number.isInteger(+v) && +v > 0, {
		message: "Must be a positive integer",
	}),
	num2: z.string().refine((v) => v !== "" && Number.isInteger(+v) && +v > 0, {
		message: "Must be a positive integer",
	}),
});

export type FormSchema = typeof formSchema;
