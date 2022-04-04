import config from '../config/config';
import { Express } from 'express';
import {
  createUserHandler,
  getUserDetailsHandler,
  updateUserDetailsHandler,
} from '../controllers/user.controller';
import validateResource from '../middlewares/validateResource';
import { createUserSchema } from '../schemas/user.schema';
import {
  createSessionHandler,
  deleteSessionHandler,
  getSessionsHandler,
} from '../controllers/session.controller';
import { createSessionSchema } from '../schemas/session.schema';
import requiredUser from '../middlewares/requiredUser';

const BASE_URL: string = config.BASE_URL;

/**
 * User Routes is all the available routes for user resource
 */
export const userRoutes = (server: Express) => {
  server.post(
    BASE_URL + '/users',
    validateResource(createUserSchema),
    createUserHandler
  );
  server.post(
    BASE_URL + '/sessions',
    validateResource(createSessionSchema),
    createSessionHandler
  );
  server.get(BASE_URL + '/sessions', requiredUser, getSessionsHandler);
  server.delete(BASE_URL + '/sessions', requiredUser, deleteSessionHandler);
  server.get(BASE_URL + '/users/:userId', requiredUser, getUserDetailsHandler);
  server.patch(
    BASE_URL + '/users',
    [validateResource(createUserSchema), requiredUser],
    updateUserDetailsHandler
  );
};
