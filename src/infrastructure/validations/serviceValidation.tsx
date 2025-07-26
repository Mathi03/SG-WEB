import { z } from "zod";

export const serviceSchema = z
  .object({
    reproductionEventId: z.number().optional(),
    animalId: z.number({
      required_error: "Vaca requerida",
    }),
    farmId: z.number().optional(),
    date: z.coerce.date({
      required_error: "Fecha del evento requerida",
    }),
    reproductiveMethodId: z.coerce.number({
      required_error: "Método reproductivo requerido",
    }),
    eventNotes: z.string().nullable().optional(),
    motherTagNumber: z.string().nullable().optional(),
    motherName: z.string().nullable().optional(),
    donorAnimalId: z.number().nullable().optional(),
    semenBatch: z.string().nullable().optional(),
    strawsUsed: z.coerce.number().nullable().optional(),
    inseminatedBy: z.string().nullable().optional(),
    inseminationNotes: z.string().nullable().optional(),
    matingMaleId: z.number().nullable().optional(),
    matingDetails: z.string().nullable().optional(),
    matingName: z.string().nullable().optional(),
    matingTagNumber: z.string().nullable().optional(),
    performedBy: z.string().nullable().optional(),
    performedNotes: z.string().nullable().optional(),
    donorEmbryoAnimalId: z.number().nullable().optional(),
    embryoBatch: z.string().nullable().optional(),
    transferPerson: z.string().nullable().optional(),
    transferNotes: z.string().nullable().optional(),
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),

    typeService: z.string().optional(),
    tagNumberMale: z.string().nullable().optional(),
    nameMale: z.string().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    const method = data.typeService;

    if (method === "IA") {
      if (!data.semenBatch) {
        ctx.addIssue({
          path: ["semenBatch"],
          message: "Lote de semen requerido para inseminación",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.inseminatedBy) {
        ctx.addIssue({
          path: ["inseminatedBy"],
          message: "Nombre del inseminador requerido",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (method === "MN") {
      if (!data.matingMaleId) {
        ctx.addIssue({
          path: ["matingMaleId"],
          message: "Toro requerido para monta natural",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.performedBy) {
        ctx.addIssue({
          path: ["performedBy"],
          message: "Nombre del responsable requerido",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (method === "TE") {
      if (!data.embryoBatch) {
        ctx.addIssue({
          path: ["embryoBatch"],
          message: "Lote de embriones requerido",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.transferPerson) {
        ctx.addIssue({
          path: ["transferPerson"],
          message: "Nombre del transferencista requerido",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
export type ServiceSchema = z.infer<typeof serviceSchema>;
