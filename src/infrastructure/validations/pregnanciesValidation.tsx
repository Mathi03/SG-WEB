import { z } from "zod";

export const pregnanciesSchema = z.object({
  id: z.number().optional(),
  farmId: z.number().optional(),
  animalId: z.number({
    required_error: "Vaca requerida",
  }),
  palpationId: z.number({
    required_error: "Palpación requerida",
  }),
  date: z.coerce.date({
    required_error: "Fecha del diagnóstico requerida",
  }),
  expectedDueDate: z.coerce.date({
    required_error: "Fecha estimada de parto requerida",
  }),
  status: z.enum(["ongoing", "aborted", "completed"]).nullable().optional(),
  animalName: z.string().optional(),
  tagNumber: z.string().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type PregnanciesSchema = z.infer<typeof pregnanciesSchema>;
