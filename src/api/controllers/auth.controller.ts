import { NextFunction, Request, Response } from 'express';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { User } from '../../interfaces';
import { AuthService } from '../services';

export class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: LoginUserDto = req.body;
      const userAndToken = await this.authService.login(userData);

      res.status(200).json({ data: userAndToken, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
}
