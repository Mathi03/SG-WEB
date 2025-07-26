import { z } from "zod";

export const vaccinesSchema = z.object({
  id: z.number().optional(),
  farmId: z.number().optional(),
  animalId: z.number({
    required_error: "Vaca requerida",
  }),
  animalName: z.string().optional(),
  tagNumber: z.string().optional(),
  vaccinatedAt: z.coerce.date({
    required_error: "Fecha de vacunación requerida",
  }),
  vaccinatedBy: z.string().min(3, {
    message: "Veterinario requerido",
  }),
  notes: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type VaccinesSchema = z.infer<typeof vaccinesSchema>;
