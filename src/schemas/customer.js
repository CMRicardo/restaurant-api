import { z } from 'zod'

const customerSchema = z.object({
  first_name: z.string({
    required_error: 'First name is required'
  }),
  second_name: z.string().optional(),
  last_name: z.string({
    required_error: 'Last name is required'
  }),
  email: z.string({
    required_error: 'Email is required'
  }),
  password: z.string().min(6),
  phone_number: z.number({
    required_error: 'Phone number is required'
  }).int().min(1111_1111)
})

export const validateCustomer = (object) => {
  return customerSchema.safeParse(object)
}

export const validatePartialCustomer = (object) => {
  return customerSchema.partial().safeParse(object)
}
