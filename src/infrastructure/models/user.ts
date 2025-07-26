import { z } from "zod";

const user = z.object({
  name: z.string().nullable().nullable(),
  lastname: z.string().nullable(),
  identifier: z.string().nullable(),
  dob: z.string().nullable(),
  email: z.string().nullable(),
  sex: z.string().nullable(),
  username: z.string().nullable(),
  password: z.string().nullable(),
  phone: z.string().nullable(),
  city: z.string().nullable(),
  tyc: z.boolean(),
  country: z.string().nullable(),
});

export type User = z.infer<typeof user>;

export default user;
