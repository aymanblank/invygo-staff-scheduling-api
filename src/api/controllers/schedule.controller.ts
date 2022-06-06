import { NextFunction, Request, Response } from 'express';
import { CreateScheduleDto, FilterScheduleDto } from '../dtos';
import { Schedule } from '../../interfaces';
import { ScheduleService } from '../services';

export class ScheduleController {
  public scheduleService = new ScheduleService();

  public getSchedules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scheduleFilters: FilterScheduleDto = req.query as unknown as FilterScheduleDto;
      const schedules: Schedule[] = await this.scheduleService.findAllSchedules(scheduleFilters);

      res.status(200).json({ data: schedules, message: 'Get Schedules' });
    } catch (error) {
      next(error);
    }
  };

  public getSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scheduleId = Number(req.params.id);
      const schedule: Schedule = await this.scheduleService.findScheduleById(scheduleId);

      res.status(200).json({ data: schedule, message: 'Get Schedule' });
    } catch (error) {
      next(error);
    }
  };

  public createSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scheduleData: CreateScheduleDto = req.body;
      const schedule: Schedule = await this.scheduleService.createSchedule(scheduleData);

      res.status(200).json({ data: schedule, message: 'Create Schedule' });
    } catch (error) {
      next(error);
    }
  };

  public updateSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scheduleId = Number(req.params.id);
      const scheduleData: CreateScheduleDto = req.body;
      const schedule: Schedule = await this.scheduleService.updateSchedule(scheduleId, scheduleData);

      res.status(200).json({ data: schedule, message: 'Update Schedule' });
    } catch (error) {
      next(error);
    }
  };

  public deleteSchedule = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const scheduleId = Number(req.params.id);
      const schedule: Schedule = await this.scheduleService.deleteSchedule(scheduleId);

      res.status(200).json({ data: schedule, message: 'Delete Schedule' });
    } catch (error) {
      next(error);
    }
  };
}
