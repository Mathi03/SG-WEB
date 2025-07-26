import { z } from "zod";

export const expectedBirthsSchema = z.object({
  animalId: z.number({
    required_error: "Vaca requerida",
  }),
  date: z.coerce.date({
    required_error: "Fecha requerida",
  }),
  tagNumber: z.string().optional(),
  animalName: z.string().optional(),
});

export type ExpectedBirthsSchema = z.infer<typeof expectedBirthsSchema>;
