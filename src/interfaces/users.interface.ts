import { Role } from '../interfaces';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UserWithAccumulatedWorkHours {
  id: number;
  name: string;
  accumulatedWorkHours: number;
}
