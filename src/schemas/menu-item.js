import { z } from 'zod'

const menuItemSchema = z.object({
  category: z.string(),
  name: z.string().min(3),
  description: z.string(),
  price: z.number().min(0.99).max(500),
  imageUrl: z.string()
})

export const validateMenuItem = (object) => {
  return menuItemSchema.safeParse(object)
}

export const validatePartialMenuItem = (object) => {
  return menuItemSchema.partial().safeParse(object)
}
