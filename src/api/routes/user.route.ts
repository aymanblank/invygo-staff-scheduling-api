import { Router } from 'express';
import { Route } from '../../interfaces';
import { UserController } from '../controllers';
import { ROUTE_ACCESS_PERMISSIONS } from '../../config';
import { CreateUserDto, FilterUserDto } from '../dtos';
import { AuthMiddleware, validationMiddleware, accessMiddleware } from '../middlewares';

export class UserRoute implements Route {
  public path = '/user';
  public router = Router();
  public userController = new UserController();
  public authMW = new AuthMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.authMW.authMiddleware, accessMiddleware(ROUTE_ACCESS_PERMISSIONS.GET_USERS), this.userController.getUsers);
    this.router.get(
      `${this.path}/:id(\\d+)`,
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.GET_USER),
      this.userController.getUser,
    );
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.CREATE_USER),
      this.userController.createUser,
    );
    this.router.put(
      `${this.path}/:id(\\d+)`,
      validationMiddleware(CreateUserDto, 'body'),
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.UPDATE_USER),
      this.userController.updateUser,
    );
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.DELETE_USER),
      this.userController.deleteUser,
    );
    this.router.get(
      `${this.path}/list-by-accumulated-work-hours`,
      validationMiddleware(FilterUserDto, 'query'),
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.GET_USERS_LIST_BY_ACCUMULATED_WORK_HOURS),
      this.userController.getUsersListByAccumulatedWorkHours,
    );
  }
}
