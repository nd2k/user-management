import config from '../config/config';
import { Express } from 'express';
import { createUserHandler } from '../controllers/user.controller';
import validateResource from '../middlewares/validateResource';
import { createUserSchema } from '../schemas/user.schema';

const BASE_URL: string = config.BASE_URL;

export const identificationRoutes = (server: Express) => {
  server.post(
    BASE_URL + '/users',
    validateResource(createUserSchema),
    createUserHandler
  );
  server.post(BASE_URL + '/session', (req, res) => {
    return res.send('Login').status(200);
  });
};
