import { z } from 'zod'

const saleSchema = z.object({
  seller: z.string(),
  sellerId: z.string(),
  date: z.coerce.date(),
  items: z.array(z.object({
    name: z.string(),
    price: z.number().min(0.99),
    quantity: z.number().min(1)
  })).nonempty(),
  subtotal: z.number().min(1),
  taxes: z.number().default(0.15),
  total: z.number().positive()
})

export const validateSales = (object) => {
  return saleSchema.safeParse(object)
}

export const validatePartialSales = (object) => {
  return saleSchema.partial().safeParse(object)
}
