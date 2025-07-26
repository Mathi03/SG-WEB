import { z } from "zod";

export const farmSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Nombre requerido"),
  createdAt: z.date(),
  serviceSymbol: z.string().min(1, "Servicios requeridos"),
  weightUnitSymbol: z.string().min(1, "Medida de pesaje requerida"),
  volumeUnitSymbol: z.string().min(1, "Medida de producción lechera requerida"),
  currencyUnitSymbol: z.string().min(1, "Moneda requerida"),
});

export type FarmSchema = z.infer<typeof farmSchema>;
