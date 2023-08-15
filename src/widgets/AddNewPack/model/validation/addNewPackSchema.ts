import { z } from 'zod'

export const addNewPackSchema = z.object({
  name: z
    .string()
    .min(3, 'Name should be at least 3 characters long')
    .max(20, 'Name should be at most 20 characters long'),
  isPrivate: z.boolean().default(false),
})
