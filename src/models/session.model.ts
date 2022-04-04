import mongoose from 'mongoose';
import { UserDocument } from './user.model';

export interface SessionDocument extends mongoose.Document {
  user: UserDocument['_id'];
  isValid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session Schema is the schema related to Session object
 */
const SessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isValid: { type: Boolean, default: true },
    userAgent: { type: String },
  },
  { timestamps: true }
);

const Session = mongoose.model<SessionDocument>('Session', SessionSchema);

export default Session;
