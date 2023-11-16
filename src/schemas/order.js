import { z } from 'zod'

const orderSchema = z.object({
  idCustomer: z.string(),
  firstNameCustomer: z.string(),
  lastNameCustomer: z.string(),
  items: z.array(
    z.object({
      name: z.string(),
      price: z.number().min(0.99),
      quantity: z.number().min(1)
    })
  ),
  subtotal: z.number().positive()
})

export const validateOrder = (object) => {
  return orderSchema.safeParse(object)
}

export const validatePartialOrder = (object) => {
  return orderSchema.partial().safeParse(object)
}
