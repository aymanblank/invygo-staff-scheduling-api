import { Request } from 'express';
import { User } from '../interfaces';

export interface DataStoredInToken {
  id: number;
  name: string;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
