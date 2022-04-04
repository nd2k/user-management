import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../services/session.service';
import { verifyJwt } from '../utils/jwt.util';

/**
 * Deserialize User is a middleware used to deserialize a user from AccessToken or RefreshToken
 * @param req - request received from client
 * @param res - response sent to client
 * @param next - next middleware
 * @returns a user attached to the response - locals
 */
const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  const refreshToken = get(req, 'headers.x-refresh');

  if (!accessToken) {
    return next();
  }

  const { decoded, expired } = verifyJwt(accessToken);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
    }
    const result = verifyJwt(newAccessToken);
    res.locals.user = result.decoded;
    return next();
  }
  return next();
};

export default deserializeUser;
