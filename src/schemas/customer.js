import { z } from 'zod'

const customerSchema = z.object({
  firstName: z.string({
    required_error: 'First name is required'
  }),
  secondName: z.string().optional(),
  lastName: z.string({
    required_error: 'Last name is required'
  }),
  email: z.string({
    required_error: 'Email is required'
  }),
  password: z.string().min(6),
  phoneNumber: z.number({
    required_error: 'Phone number is required'
  }).int().min(1111_1111),
  address: z.string().min()
})

export const validateCustomer = (object) => {
  return customerSchema.safeParse(object)
}

export const validatePartialCustomer = (object) => {
  return customerSchema.partial().safeParse(object)
}
