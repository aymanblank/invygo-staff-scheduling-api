import { Router } from 'express';
import { Route } from '../../interfaces';
import { AuthController } from '../controllers';
import { CreateUserDto, LoginUserDto } from '../dtos';
import { validationMiddleware } from '../middlewares';

export class AuthRoute implements Route {
  public path = '/';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}signup`, validationMiddleware(CreateUserDto, 'body'), this.authController.signUp);
    this.router.post(`${this.path}login`, validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
  }
}
