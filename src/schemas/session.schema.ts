import { object, string } from 'zod';

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: 'Email is a mandatory field.',
    }),
    password: string({
      required_error: 'Password is a mandatory field.',
    }),
  }),
});
