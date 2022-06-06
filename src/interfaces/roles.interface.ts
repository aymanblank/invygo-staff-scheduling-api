import { Permission } from '../interfaces';
export interface Role {
  id: number;
  name: string;
  permissions?: Permission[];
}
