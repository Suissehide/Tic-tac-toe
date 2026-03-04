import { z } from 'zod/v4'

import { userSchema } from './auth.schema'

export const userResponseSchema = userSchema.extend({
  id: z.cuid(),
})

export const usersResponseSchema = z.array(userResponseSchema)

export const getUserByIdParamsSchema = z.object({
  userID: z.cuid(),
})

export const deleteUserByIdParamsSchema = getUserByIdParamsSchema

export const updateUserByIdSchema = {
  params: getUserByIdParamsSchema,
  body: userSchema.partial().extend({}),
}

export type UserInput = z.infer<typeof userSchema>
export type GetUserByIdParams = z.infer<typeof getUserByIdParamsSchema>
export type UpdateUserParams = z.infer<typeof updateUserByIdSchema.params>
export type UpdateUserBody = z.infer<typeof updateUserByIdSchema.body>
export type DeleteUserByIdParams = z.infer<typeof deleteUserByIdParamsSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
