import { Request, Response } from 'express';
import { omit } from 'lodash';
import { CreateUserInput } from '../schemas/user.schema';
import {
  createUser,
  findUser,
  updateUserDetails,
} from '../services/user.service';
import log from '../utils/logger.util';

/**
 * Create User Handler is creating the user
 * @param req - request received from client
 * @param res - response sent to client
 * @returns a created user
 */
export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) => {
  try {
    const user = await createUser(req.body);
    return res.send(user).status(201);
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
};

/**
 * Get User Details Handler is getting all the user's details
 * @param req - request received from client
 * @param res - response sent to client
 * @returns details user
 */
export const getUserDetailsHandler = async (req: Request, res: Response) => {
  const userId: string = req.params.userId;
  const user = await findUser({ _id: userId });
  if (user) {
    return res.send(user).status(200);
  }
  return res.send('No user found').status(404);
};

export const updateUserDetailsHandler = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response
) => {
  const user = await updateUserDetails(req.body);
  return res.send(user).status(200);
};
