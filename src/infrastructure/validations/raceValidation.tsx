import { z } from "zod";

export const raceSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nombre requerido"),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type RaceSchema = z.infer<typeof raceSchema>;
