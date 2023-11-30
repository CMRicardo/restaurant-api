import { z } from 'zod'

const EmployeeSchema = z.object({
  employeeType: z.string(),
  firstName: z.string(),
  secondName: z.string().optional(),
  lastName: z.string(),
  idNumber: z.string().length(13),
  phoneNumber: z.number().min(11111111),
  email: z.string().email(),
  password: z.string(),
  profilePictureUrl: z.string().url(),
  address: z.string()
})

export const validateEmployee = (object) => {
  return EmployeeSchema.safeParse(object)
}

export const validateParcialEmployee = (object) => {
  return EmployeeSchema.partial().safeParse(object)
}
