import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export interface Permissions {
  View_Own_Schedules: string;
  Create_Own_Schedules: string;
  Update_Own_Schedules: string;
  Delete_Own_Schedules: string;
  View_Schedules: string;
  Create_Schedules: string;
  Update_Schedules: string;
  Delete_Schedules: string;
  View_Own_User: string;
  Update_Own_User: string;
  Delete_Own_User: string;
  View_Users: string;
  Create_Users: string;
  Update_Users: string;
  Delete_Users: string;
  View_Users_By_Accumulated_Work_hours: string;
}

export const PERMISSIONS: Permissions = {
  View_Own_Schedules: 'View_Own_Schedules',
  Create_Own_Schedules: 'Create_Own_Schedules',
  Update_Own_Schedules: 'Update_Own_Schedules',
  Delete_Own_Schedules: 'Delete_Own_Schedules',
  View_Schedules: 'View_Schedules',
  Create_Schedules: 'Create_Schedules',
  Update_Schedules: 'Update_Schedules',
  Delete_Schedules: 'Delete_Schedules',
  View_Own_User: 'View_Own_User',
  Update_Own_User: 'Update_Own_User',
  Delete_Own_User: 'Delete_Own_User',
  View_Users: 'View_Users',
  Create_Users: 'Create_Users',
  Update_Users: 'Update_Users',
  Delete_Users: 'Delete_Users',
  View_Users_By_Accumulated_Work_hours: 'View_Users_By_Accumulated_Work_hours',
};

type PermissionKey = keyof Permissions;

export const ROLES = {
  STAFF_USER: {
    name: 'STAFF_USER',
    permissions: [{ title: PERMISSIONS.View_Own_User }, { title: PERMISSIONS.View_Own_Schedules }, { title: PERMISSIONS.View_Schedules }],
  },
  ADMIN: {
    name: 'ADMIN',
    permissions: [
      { title: PERMISSIONS.View_Users },
      { title: PERMISSIONS.Create_Users },
      { title: PERMISSIONS.Update_Users },
      { title: PERMISSIONS.Delete_Users },
      { title: PERMISSIONS.View_Schedules },
      { title: PERMISSIONS.Create_Schedules },
      { title: PERMISSIONS.Update_Schedules },
      { title: PERMISSIONS.Delete_Schedules },
      { title: PERMISSIONS.View_Users_By_Accumulated_Work_hours },
    ],
  },
};

export interface Routes {
  GET_USERS: string;
  GET_USERS_LIST_BY_ACCUMULATED_WORK_HOURS: string;
  GET_USER: string;
  CREATE_USER: string;
  UPDATE_USER: string;
  DELETE_USER: string;
  GET_SCHEDULES: string;
  GET_SCHEDULE: string;
  CREATE_SCHEDULE: string;
  UPDATE_SCHEDULE: string;
  DELETE_SCHEDULE: string;
}

type RouteKey = keyof Routes;

export const ROUTES: Routes = {
  GET_USERS: 'GET_USERS',
  GET_USER: 'GET_USER',
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  GET_SCHEDULES: 'GET_SCHEDULES',
  GET_SCHEDULE: 'GET_SCHEDULE',
  CREATE_SCHEDULE: 'CREATE_SCHEDULE',
  UPDATE_SCHEDULE: 'UPDATE_SCHEDULE',
  DELETE_SCHEDULE: 'DELETE_SCHEDULE',
  GET_USERS_LIST_BY_ACCUMULATED_WORK_HOURS: 'GET_USERS_LIST_BY_ACCUMULATED_WORK_HOURS',
};

export interface RouteAccess {
  id: RouteKey;
  permissions: PermissionKey[];
}

export type RouteAccessPermissions = {
  [key in RouteKey]: RouteAccess;
};

export const ROUTE_ACCESS_PERMISSIONS: RouteAccessPermissions = {
  GET_USERS: { id: ROUTES.GET_USERS as RouteKey, permissions: [PERMISSIONS.View_Users] as PermissionKey[] },
  GET_USER: { id: ROUTES.GET_USER as RouteKey, permissions: [PERMISSIONS.View_Users, PERMISSIONS.View_Own_User] as PermissionKey[] },
  CREATE_USER: { id: ROUTES.CREATE_USER as RouteKey, permissions: [PERMISSIONS.Create_Users] as PermissionKey[] },
  UPDATE_USER: { id: ROUTES.UPDATE_USER as RouteKey, permissions: [PERMISSIONS.Update_Users, PERMISSIONS.Update_Own_User] as PermissionKey[] },
  DELETE_USER: { id: ROUTES.DELETE_USER as RouteKey, permissions: [PERMISSIONS.Delete_Users, PERMISSIONS.Delete_Own_User] as PermissionKey[] },
  GET_SCHEDULES: { id: ROUTES.GET_SCHEDULES as RouteKey, permissions: [PERMISSIONS.View_Schedules] as PermissionKey[] },
  GET_SCHEDULE: { id: ROUTES.GET_SCHEDULE as RouteKey, permissions: [PERMISSIONS.View_Schedules, PERMISSIONS.View_Own_Schedules] as PermissionKey[] },
  CREATE_SCHEDULE: { id: ROUTES.CREATE_SCHEDULE as RouteKey, permissions: [PERMISSIONS.Create_Schedules] as PermissionKey[] },
  UPDATE_SCHEDULE: { id: ROUTES.UPDATE_SCHEDULE as RouteKey, permissions: [PERMISSIONS.Update_Schedules] as PermissionKey[] },
  DELETE_SCHEDULE: { id: ROUTES.DELETE_SCHEDULE as RouteKey, permissions: [PERMISSIONS.Delete_Schedules] as PermissionKey[] },
  GET_USERS_LIST_BY_ACCUMULATED_WORK_HOURS: {
    id: ROUTES.GET_USERS_LIST_BY_ACCUMULATED_WORK_HOURS as RouteKey,
    permissions: [PERMISSIONS.View_Users_By_Accumulated_Work_hours] as PermissionKey[],
  },
};

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
