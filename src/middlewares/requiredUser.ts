import { Request, Response, NextFunction } from 'express';

/**
 * Required User is a middleware checking if a authenticatd user is present in the response
 * @param req - request received from client
 * @param res - response sent to client
 * @param next - next middleware
 * @returns next middleware or unauthorized status code
 */
const requiredUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(403);
  }

  return next();
};

export default requiredUser;
