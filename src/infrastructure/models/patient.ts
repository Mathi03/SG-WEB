import { z } from "zod";

const patientParser = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  lastname: z.string().nullable(),
  dob: z.coerce.date().nullable(),
  gender: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  social_security_number: z.string().nullable(),
  user_id: z.string().nullable(),
});

export type PatientParser = z.infer<typeof patientParser>;

export default patientParser;
