import { z } from "zod";

export const geneticSchema = z.object({
  id: z.number().optional(),
  farmId: z.number().optional(),
  uniqueCode: z
    .string({
      required_error: "Código único requerido",
    })
    .min(1, "El código único no puede estar vacío"),
  stock: z.coerce
    .number({
      required_error: "Stock requerido",
    })
    .min(0, "El stock no puede ser negativo"),
  purchasePrice: z.coerce
    .number({
      required_error: "Precio de compra requerido",
    })
    .min(0.01, "El precio debe ser mayor a 0"),
  purchaseDate: z.coerce.date({
    required_error: "Fecha de compra requerida",
  }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type GeneticsSchema = z.infer<typeof geneticSchema>;
