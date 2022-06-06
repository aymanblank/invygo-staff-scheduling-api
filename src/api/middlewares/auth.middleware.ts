import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY, NODE_ENV } from '../../config';
import { UserRepository } from '../../data/repositories';
import { HttpException } from '../exceptions';
import { DataStoredInToken, RequestWithUser } from '../../interfaces';

export class AuthMiddleware {
  public userRepository = UserRepository;

  public authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = NODE_ENV !== 'test' ? (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null) : 'token';

      if (Authorization) {
        const secretKey: string = SECRET_KEY;
        const { id } = NODE_ENV !== 'test' ? (verify(Authorization, secretKey) as DataStoredInToken) : { id: 1 };
        const user = await this.userRepository.findByIdWithRelations(id);
        if (user) {
          req.user = user;
          next();
        } else {
          next(new HttpException(401, 'Wrong authentication token'));
        }
      } else {
        next(new HttpException(404, 'Authentication token is missing'));
      }
    } catch (error) {
      next(new HttpException(401, 'Wrong authentication token'));
    }
  };
}
