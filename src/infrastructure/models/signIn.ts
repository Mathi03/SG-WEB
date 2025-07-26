import { object, z } from "zod";

const signIn = z.object({
  data: z
    .object({
      token: z.string().nullable(),
      user: object({
        created_at: z.string().nullable(),
        email: z.string().nullable(),
        external_id: z.string().nullable(),
        id: z.string().nullable(),
        lastname: z.string().nullable(),
        name: z.string().nullable(),
        password: z.string().nullable(),
        role: z.string().nullable(),
        username: z.string().nullable(),
      }),
    })
    .nullable(),
  success: z.boolean().nullable(),
});

export type SignIn = z.infer<typeof signIn>;

export default signIn;
