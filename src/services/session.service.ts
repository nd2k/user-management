import Session, { SessionDocument } from '../models/session.model';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { signJwt, verifyJwt } from '../utils/jwt.util';
import { get } from 'lodash';
import { findUser } from './user.service';
import config from '../config/config';

/**
 * Create Session is a service creating a session for an authenticated user
 * @param userId - User id
 * @param userAgent - User agent (brwoser type)
 * @returns a session
 */
export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
};

/**
 * Find Sessions is a service finding all the sessions related to a user
 * @param query - query to fetch all sessions
 * @returns all the sessions
 */
export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return Session.find(query).lean();
};

/**
 * Update Session is a service updating a specific session related to a user
 * @param query - query to update a session
 * @param updateSess - value of the new session
 * @returns an updated session
 */
export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  updateSess: UpdateQuery<SessionDocument>
) => {
  return Session.updateOne(query, updateSess);
};

/**
 * Reissue Access Token is a service regeneratin an Access Token based on the Refresh Token
 * @param refreshToken - Refresh Token
 * @returns an Access Token
 */
export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}): Promise<string> => {
  const { decoded } = verifyJwt(refreshToken);

  if (!decoded || !get(decoded, 'session')) {
    return '';
  }

  const session = await Session.findById(get(decoded, 'session'));

  if (!session || !session.isValid) {
    return '';
  }

  const user = await findUser({ _id: session.user });

  if (!user) {
    return '';
  }

  return signJwt(
    { ...user, session: session._id },
    { expiresIn: config.ACCESS_TOKEN_DURATION }
  );
};
