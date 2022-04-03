import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is a mandatory field.',
    }),
    password: string({
      required_error: 'Password is a mandatory field.',
    }).min(6, 'Password must be at least 6 characters.'),
    passwordConfirmation: string({
      required_error: 'Password confirmation is a mandatory field.',
    }),
    email: string({
      required_error: 'Email is a mandatory field.',
    }).email('Email not valid.'),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  }),
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>;
