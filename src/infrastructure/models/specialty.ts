import { z } from "zod";

const doctorParser = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  label: z.string().nullable(),
  hourly_rate: z.string().nullable(),
});

export type DoctorParser = z.infer<typeof doctorParser>;

export default doctorParser;
