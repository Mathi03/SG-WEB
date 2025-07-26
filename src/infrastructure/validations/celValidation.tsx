import { z } from "zod";

export const celSchema = z.object({
  id: z.number().optional(),
  animalId: z.number({
    required_error: "Vaca requerida",
  }),
  tagNumber: z.string().optional(),
  animalName: z.string().optional(),
  farmId: z.number().optional(),
  dateObserved: z.coerce.date({
    required_error: "Fecha de observación requerida",
  }),
  symptoms: z.string(),
  observedBy: z
    .string({
      required_error: "Nombre del observador requerido",
    })
    .min(1, "Debe ingresar el nombre del observador"),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type CelSchema = z.infer<typeof celSchema>;
