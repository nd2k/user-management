import { Request, Response, NextFunction } from 'express';
import { get } from 'lodash';
import { reIssueAccessToken } from '../services/session.service';
import { verifyJwt } from '../utils/jwt.util';

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
  console.log(decoded, expired);

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (!expired && refreshToken) {
    const newAccessToken = await reIssueAccessToken({ refreshToken });
    console.log(newAccessToken);

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
