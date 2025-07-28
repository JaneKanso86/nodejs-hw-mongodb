import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Session = mongoose.model('Session', sessionSchema);

export const saveSession = async (sessionData) => {
  return await Session.create(sessionData);
};

export const findSessionByRefreshToken = async (refreshToken) => {
  return await Session.findOne({ refreshToken });
};

export const deleteSessionByUserId = async (userId) => {
  return await Session.deleteMany({ userId });
};

export const deleteSessionById = async (sessionId) => {
  return await Session.findByIdAndDelete(sessionId);
};
