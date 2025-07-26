import { z } from "zod";

export const weighingSchema = z.object({
  id: z.number().optional(),
  farmId: z.number().optional(),
  tagNumber: z.string().optional(),
  animalName: z.string().optional(),
  animalId: z.number({
    required_error: "Vaca requerida",
  }),
  weight: z.coerce
    .number({
      required_error: "Peso requerido",
    })
    .min(0.1, "El peso debe ser mayor a 0"),
  weighedAt: z.coerce.date({
    required_error: "Fecha de pesaje requerida",
  }),
  notes: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type WeighingSchema = z.infer<typeof weighingSchema>;
