import jwt from 'jsonwebtoken';
import config from '../config/config';

const PRIVATE_KEY = config.PRIVATE_KEY;
const PUBLIC_KEY = config.PUBLIC_KEY;

/**
 * Sign Jwt is an util to sign the password
 * @param object - object to sign
 * @param options - Jwt options
 * @returns a sign password
 */
export const signJwt = (
  object: Object,
  options?: jwt.SignOptions | undefined
) => {
  return jwt.sign(object, PRIVATE_KEY, {
    ...options,
    algorithm: 'RS256',
  });
};

/**
 * Verify Jwt is an util verifying Jwt
 * @param token - Jwt to validate
 * @returns decoded token with an expiration flag & a valid flag
 */
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
      expired: true,
      decoded: null,
    };
  }
};
