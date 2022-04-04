import Session, { SessionDocument } from '../models/session.model';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { signJwt, verifyJwt } from '../utils/jwt.util';
import { get } from 'lodash';
import { findUser } from './user.service';
import config from '../config/config';

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });
  return session.toJSON();
};

export const findSessions = async (query: FilterQuery<SessionDocument>) => {
  return Session.find(query).lean();
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  updateSess: UpdateQuery<SessionDocument>
) => {
  return Session.updateOne(query, updateSess);
};

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
