import { z } from "zod";

const formatAge = (birthDate: Date | null): string => {
  if (!birthDate) return "0 días";

  const now = new Date();

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} año${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mes${months > 1 ? "es" : ""}`);
  if (days > 0) parts.push(`${days} día${days > 1 ? "s" : ""}`);

  return parts.length ? parts.join(", ") : "0 días";
};

export const animalSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, "Nombre requerido").nullable(),
    tagNumber: z.string().min(1, "Nro. Arete requerido").nullable(),
    birthDate: z.coerce.date().nullable(),
    status: z.string().min(1, "Estado requerido").nullable(),
    classification: z.string().min(1, "Clasificación requerida").nullable(),
    breed: z.record(z.number()).nullable(),
    sex: z.string().min(1, "Género requerido").nullable(),
  })
  .transform((data) => ({
    ...data,
    age: formatAge(data.birthDate),
  }));

export type AnimalSchema = z.infer<typeof animalSchema>;

export const animalFormSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().min(1, "Nombre requerido").nullable(),
    tagNumber: z.string().min(1, "Nro. Arete requerido").nullable(),
    birthDate: z.coerce.date().nullable(),
    status: z.string().min(1, "Estado requerido").nullable(),
    classification: z.string().min(1, "Clasificación requerida").nullable(),
    sex: z.string().min(1, "Género requerido").nullable(),
    races: z
      .array(
        z.object({
          id: z.string().optional(),
          name: z.string().min(1, "Raza requerida"),
          percentage: z.preprocess(
            (val) => Number(val),
            z
              .number()
              .min(0, "Porcentaje debe ser mayor o igual a 0")
              .max(100, "Porcentaje debe ser menor o igual a 100")
          ),
        })
      )
      .nonempty("Debe tener al menos una raza"),
  })
  .refine(
    (data) => {
      const total = (data.races || []).reduce(
        (acc, r) => acc + r.percentage,
        0
      );
      return total === 100;
    },
    {
      path: ["races"],
      message: "La suma de los porcentajes debe ser igual a 100%",
    }
  )
  .refine(
    (data) => {
      return data?.races.length > 0;
    },
    {
      path: ["races"],
      message: "Debe tener al menos una raza",
    }
  );

export type AnimalFormSchema = z.infer<typeof animalFormSchema>;
