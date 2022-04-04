import { object, string } from 'zod';

/**
 * Create Session Schema is creating a session validation schema
 */
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
