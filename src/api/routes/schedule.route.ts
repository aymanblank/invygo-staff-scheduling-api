import { Router } from 'express';
import { Route } from '../../interfaces';
import { ScheduleController } from '../controllers';
import { ROUTE_ACCESS_PERMISSIONS } from '../../config';
import { CreateScheduleDto, FilterScheduleDto } from '../dtos';
import { AuthMiddleware, validationMiddleware, accessMiddleware } from '../middlewares';

export class ScheduleRoute implements Route {
  public path = '/schedule';
  public router = Router();
  public scheduleController = new ScheduleController();
  public authMW = new AuthMiddleware();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}`,
      validationMiddleware(FilterScheduleDto, 'query'),
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.GET_SCHEDULES),
      this.scheduleController.getSchedules,
    );
    this.router.get(
      `${this.path}/:id(\\d+)`,
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.GET_SCHEDULE),
      this.scheduleController.getSchedule,
    );
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateScheduleDto, 'body'),
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.CREATE_SCHEDULE),
      this.scheduleController.createSchedule,
    );
    this.router.put(
      `${this.path}/:id(\\d+)`,
      validationMiddleware(CreateScheduleDto, 'body'),
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.UPDATE_SCHEDULE),
      this.scheduleController.updateSchedule,
    );
    this.router.delete(
      `${this.path}/:id(\\d+)`,
      this.authMW.authMiddleware,
      accessMiddleware(ROUTE_ACCESS_PERMISSIONS.DELETE_SCHEDULE),
      this.scheduleController.deleteSchedule,
    );
  }
}
