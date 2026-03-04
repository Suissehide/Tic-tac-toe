import { z } from 'zod/v4'

export const userSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? 'Email is required' : 'Email is not valid',
  }),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.enum(['NONE', 'USER', 'ADMIN']),
})

export const registerSchema = userSchema
  .pick({
    email: true,
    firstName: true,
    lastName: true,
  })
  .extend({
    password: z.string({
      error: () => 'Password is required',
    }),
  })
export const registerResponseSchema = userSchema.extend({
  id: z.string(),
})

export const signInSchema = z.object({
  email: z.email({
    error: (issue) =>
      issue.input === undefined ? 'Email is required' : 'Email is not valid',
  }),
  password: z.string(),
})
export const signInResponseSchema = z.object({
  email: z.string(),
  firstName: z.string().nullish(),
  lastName: z.string().nullish(),
})

export type SignInInput = z.infer<typeof signInSchema>
export type CreateUserInput = z.infer<typeof registerSchema>
