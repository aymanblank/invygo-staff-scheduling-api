import { NextFunction, Response, RequestHandler } from 'express';
import { HttpException } from '../exceptions';
import { RequestWithUser, User, Role } from '../../interfaces';
import { RouteAccess } from '../../config';
import { isEmpty } from 'underscore';

export const accessMiddleware = (routeAccess: RouteAccess): RequestHandler => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user: User = req.user;
      const role: Role = user?.role;
      const userPermissions = role?.permissions;

      if (isEmpty(userPermissions)) next(new HttpException(403, 'You have no access to this api'));

      let hasAccess = false;
      for (let i = 0; i < routeAccess.permissions.length; i++) {
        const permission = routeAccess.permissions[i];
        const permissionFound = userPermissions.find(userPermission => userPermission.title === permission);
        if (permissionFound) {
          hasAccess = true;
          break;
        }
      }
      if (hasAccess) {
        next();
      } else {
        next(new HttpException(403, 'You have no access to this api'));
      }
    } catch (error) {
      next(new HttpException(403, 'You have no access to this api'));
    }
  };
};
