import { z } from "zod";

export const milkProductionSchema = z.object({
  id: z.number().optional(),
  animalId: z.number({
    required_error: "Vaca requerida",
  }),
  animalName: z.string().optional(),
  tagNumber: z.string().optional(),
  milkedAt: z.coerce.date({
    required_error: "Fecha de ordeño requerida",
  }),
  shift: z.enum(["morning", "afternoon", "night"], {
    errorMap: () => ({ message: "Turno inválido" }),
  }),
  amount: z.coerce
    .number({ required_error: "Cantidad requerida" })
    .min(0.1, "Debe ser mayor a 0"),
  notes: z.string().optional(),
  isDeleted: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type MilkProductionSchema = z.infer<typeof milkProductionSchema>;
