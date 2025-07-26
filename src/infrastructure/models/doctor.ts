import { z } from "zod";

const doctorParser = z.object({
  id: z.string().nullable().optional(),
  name: z.string().nullable(),
  lastname: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  user_id: z.string().nullable(),
  specialty_id: z.string().nullable(),
  specialty_name: z.string().nullable().optional(),
  label: z.string().nullable(),
  hourly_rate: z.string().nullable(),

  // Optional fields
  identifier: z.string().nullable().optional(),
  dob: z.coerce.date().nullable().optional(),
  sex: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  password: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  tyc: z.boolean().nullable().optional(),
  country: z.string().nullable().optional(),
});

export type DoctorParser = z.infer<typeof doctorParser>;

export default doctorParser;
