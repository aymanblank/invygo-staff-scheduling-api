import { User } from '../interfaces';
export interface Schedule {
  id: number;
  date: string;
  shiftLength: number;
  userId?: number;
  user?: User;
}
