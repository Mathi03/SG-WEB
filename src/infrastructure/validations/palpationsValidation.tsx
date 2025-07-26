import { z } from "zod";

export const palpationsSchema = z.object({
  id: z.number().optional(),
  animalId: z.number({
    required_error: "Vaca requerida",
  }),
  farmId: z.number().optional(),
  date: z.coerce.date({
    required_error: "Fecha requerida",
  }),
  result: z.string().min(3, "Resultado Requerido"),
  performedBy: z
    .string({
      required_error: "Veterinario requerido",
    })
    .min(3, "Nombre demasiado corto"),
  comments: z.string().optional(),
  animalName: z.string().optional(),
  tagNumber: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type PalpationsSchema = z.infer<typeof palpationsSchema>;
