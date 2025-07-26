import { z } from "zod";

export const typeServiceSchema = z.object({
  id: z.number().optional(),
  farmId: z.number().optional(),
  name: z
    .string({
      required_error: "Nombre requerido",
    })
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  code: z
    .string({
      required_error: "Código requerido",
    })
    .min(1, "El código no puede estar vacío"),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type TypeServiceSchema = z.infer<typeof typeServiceSchema>;
