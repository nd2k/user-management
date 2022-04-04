import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config/config';

export enum Roles {
  ADMIN = 'ADMIN',
  DEFAULT = 'DEFAULT',
}

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User Schema is the schema related to User object
 */
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.role) {
    user.role = Roles.DEFAULT;
  }
  if (!user.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.SALT_WORK_FACTOR);
  const hashPassword = bcrypt.hashSync(user.password, salt);
  user.password = hashPassword;
  return next();
});

UserSchema.pre('findOneAndUpdate', async function (next) {
  // const user = this._update as UserDocument;
  const user = this.cast(this.model, this.getUpdate());
  const salt = await bcrypt.genSalt(config.SALT_WORK_FACTOR);
  const hashPassword = bcrypt.hashSync(user.password, salt);
  user.password = hashPassword;
  return next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch((e) => false);
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
