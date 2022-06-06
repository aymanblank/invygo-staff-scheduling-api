import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, FilterUserDto } from '../dtos';
import { User, UserWithAccumulatedWorkHours } from '../../interfaces';
import { UserService } from '../services';

export class UserController {
  public userService = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users: User[] = await this.userService.findAllUsers();

      res.status(200).json({ data: users, message: 'Get Users' });
    } catch (error) {
      next(error);
    }
  };

  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const user: User = await this.userService.findUserById(userId);

      res.status(200).json({ data: user, message: 'Get User' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const user: User = await this.userService.createUser(userData);

      res.status(200).json({ data: user, message: 'Create User' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData: CreateUserDto = req.body;
      const user: User = await this.userService.updateUser(userId, userData);

      res.status(200).json({ data: user, message: 'Update User' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const user: User = await this.userService.deleteUser(userId);

      res.status(200).json({ data: user, message: 'Delete User' });
    } catch (error) {
      next(error);
    }
  };

  public getUsersListByAccumulatedWorkHours = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userFilters: FilterUserDto = req.query as unknown as FilterUserDto;
      const users: UserWithAccumulatedWorkHours[] = await this.userService.findUsersListByAccumulatedWorkHours(userFilters);

      res.status(200).json({ data: users, message: 'Get Users List By Accumulated Work Hours' });
    } catch (error) {
      next(error);
    }
  };
}
