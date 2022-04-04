import jwt from 'jsonwebtoken';
import config from '../config/config';

const PRIVATE_KEY = config.PRIVATE_KEY;
const PUBLIC_KEY = config.PUBLIC_KEY;

export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, PRIVATE_KEY, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = (token: string) => {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    return {
      valid: false,
      expired: e.message === 'Token expired',
      decoded: null,
    };
  }
};
