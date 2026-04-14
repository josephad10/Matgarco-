import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

// Generate access token
export const generateAccessToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiry = (process.env.JWT_ACCESS_EXPIRY || '15m') as jwt.SignOptions['expiresIn'];
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

// Generate refresh token
export const generateRefreshToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  const expiry = (process.env.JWT_REFRESH_EXPIRY || '7d') as jwt.SignOptions['expiresIn'];
  
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  
  return jwt.sign(payload, secret, { expiresIn: expiry });
};

// Verify access token
export const verifyAccessToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.verify(token, secret) as JWTPayload;
};

// Verify refresh token
export const verifyRefreshToken = (token: string): JWTPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }
  
  return jwt.verify(token, secret) as JWTPayload;
};
