import { DocumentDefinition, FilterQuery } from 'mongoose';
import UserModel, { UserDocument } from '../models/user.model';
import { omit } from 'lodash';

/**
 * Create User is a service creating a new user
 * @param input - client input
 * @returns a user without the password
 */
export const createUser = async (
  input: DocumentDefinition<
    Omit<UserDocument, 'createdAt' | 'updatedAt' | 'comparePassword' | 'role'>
  >
) => {
  try {
    const user = await UserModel.create(input);
    return omit(user.toJSON(), 'password');
  } catch (e: any) {
    throw new Error(e);
  }
};

/**
 * Validate Password is a service validating the encrypted password
 * @param loginInput - user's credentials
 * @returns boolean
 */
export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), 'password');
};

/**
 * Find a specific user
 * @param query - query to get a specific user
 * @returns a specific user
 */
export const findUser = async (query: FilterQuery<UserDocument>) => {
  return UserModel.findOne(query).lean();
};
