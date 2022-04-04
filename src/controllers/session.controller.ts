import { Request, Response } from 'express';
import config from '../config/config';
import {
  createSession,
  findSessions,
  updateSession,
} from '../services/session.service';
import { validatePassword } from '../services/user.service';
import { signJwt } from '../utils/jwt.util';

/**
 * Create Session Handler is create a session for an authenticated user
 * @param req - request received from client
 * @param res - response sent to client
 * @returns AccessToken & RefreshToken
 */
export const createSessionHandler = async (req: Request, res: Response) => {
  const user = await validatePassword(req.body);
  if (!user) {
    return res.send('Invalid credentials.').status(401);
  }

  const session = await createSession(user._id, req.get('user-agent') || '');

  const accessToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.ACCESS_TOKEN_DURATION }
  );

  const refreshToken = signJwt(
    { ...user, session: session._id },
    { expiresIn: config.REFRESH_TOKEN_DURATION }
  );

  return res.send({ accessToken, refreshToken }).status(200);
};

/**
 * Get Session Handler is retrieving all the sessions linked to the use
 * @param req - request received from client
 * @param res - response sent to client
 * @returns all the user's sessions
 */
export const getSessionsHandler = async (req: Request, res: Response) => {
  const userId = res.locals.user._id;
  const sessions = await findSessions({ user: userId, valid: true });
  return res.send(sessions).status(200);
};

/**
 * Delete Session Handler is deleting a specific user session
 * @param req - request received from client
 * @param res - response sent to client
 * @returns AccessToken & RefreshToken to null
 */
export const deleteSessionHandler = async (req: Request, res: Response) => {
  const session = res.locals.user.session;

  await updateSession(
    {
      _id: session,
    },
    {
      valid: false,
    }
  );
  return res.send({
    accessToken: null,
    refreshToken: null,
  });
};
