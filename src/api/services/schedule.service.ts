import { CreateScheduleDto, FilterScheduleDto } from '../dtos';
import { UserRepository, ScheduleRepository } from '../../data/repositories';
import { HttpException } from '../exceptions';
import { Schedule, User } from '../../interfaces';
import { isEmpty, isNaN, isNull, isUndefined } from 'underscore';
import moment from 'moment';

export class ScheduleService {
  public userRepository = UserRepository;
  public scheduleRepository = ScheduleRepository;

  public async findScheduleById(scheduleId: number): Promise<Schedule> {
    if (isNaN(scheduleId)) throw new HttpException(409, 'The schedule id is missing');

    const schedule: Schedule = await this.scheduleRepository.findByIdWithRelations(scheduleId);
    return schedule;
  }

  public async findAllSchedules(scheduleFilters: FilterScheduleDto): Promise<Schedule[]> {
    // Set a flag to determine if the query has filters or not
    let withFilters = false;
    // Initiate a query builder
    let query = this.scheduleRepository.createQueryBuilder('schedule').leftJoinAndSelect('schedule.user', 'user');
    // Check if we got filter or not
    if (!isUndefined(scheduleFilters) && !isEmpty(scheduleFilters)) {
      // Add start date filter to the query if it exists
      if (!isEmpty(scheduleFilters.startDate)) {
        const startDate = moment(scheduleFilters.startDate).format('YYYY-MM-DD');
        query = query.where('schedule.date >= :startDate', { startDate: startDate });
        withFilters = true;
      }
      // Add end date filter to the query if it exists
      if (!isEmpty(scheduleFilters.endDate)) {
        const endDate = moment(scheduleFilters.endDate).format('YYYY-MM-DD');
        // Handle the up to 1 year condition
        if (moment(endDate).isAfter(moment().add(1, 'year'))) {
          throw new HttpException(400, `Sorry but you can only view schedules up to a year and your end date: ${endDate} has past that`);
        }
        if (withFilters) {
          query = query.andWhere('schedule.date <= :endDate', { endDate: endDate });
        } else {
          query = query.where('schedule.date <= :endDate', { endDate: endDate });
          withFilters = true;
        }
      } else {
        // Handle the up to 1 year condition if we didn't receive an ed date
        if (withFilters) {
          query = query.andWhere('date < :dateValue', { dateValue: moment().add(1, 'year').format('YYYY-MM-DD') });
        } else {
          query = query.where('date < :dateValue', { dateValue: moment().add(1, 'year').format('YYYY-MM-DD') });
          withFilters = true;
        }
      }
      // Add user id filter to the query if it exists
      if (scheduleFilters.userId && !isNaN(scheduleFilters.userId)) {
        const userId = scheduleFilters.userId;
        if (withFilters) {
          query = query.andWhere('schedule.userId = :id', { id: userId });
        } else {
          query = query.where('schedule.userId = :id', { id: userId });
          withFilters = true;
        }
      }
    }
    let schedules: Schedule[] = [];
    // Run the query
    if (withFilters) {
      schedules = await query.getMany();
    } else {
      schedules = await this.scheduleRepository
        .createQueryBuilder('schedule')
        .leftJoinAndSelect('schedule.user', 'user')
        .where('date < :dateValue', { dateValue: moment().add(1, 'year').format('YYYY-MM-DD') })
        .getMany();
    }
    return schedules;
  }

  public async createSchedule(scheduleData: CreateScheduleDto): Promise<Schedule> {
    if (isNull(scheduleData)) throw new HttpException(400, 'Some of the schedule data fields are missing');
    if (isEmpty(scheduleData?.date)) throw new HttpException(409, 'The date field is missing');
    if (isNaN(scheduleData?.shiftLength)) throw new HttpException(409, 'The shiftLength field is missing');

    let foundUser: User = null;
    if (scheduleData?.userId) {
      foundUser = await this.userRepository.findOne({ where: { id: scheduleData.userId } });
    }

    const formattedDate = moment(scheduleData.date).format('YYYY-MM-DD');

    const createdSchedule: Schedule = await this.scheduleRepository
      .create({ date: formattedDate, shiftLength: scheduleData.shiftLength, user: foundUser })
      .save();
    return createdSchedule;
  }

  public async updateSchedule(scheduleId: number, scheduleData: CreateScheduleDto): Promise<Schedule> {
    if (isNull(scheduleData)) throw new HttpException(400, 'Some of the schedule data fields are missing');
    if (isNaN(scheduleId)) throw new HttpException(409, 'The schedule id is missing');
    if (isEmpty(scheduleData?.date)) throw new HttpException(409, 'The date field is missing');
    if (isNaN(scheduleData?.shiftLength)) throw new HttpException(409, 'The shiftLength field is missing');

    let foundUser: User = null;
    if (scheduleData?.userId) {
      foundUser = await this.userRepository.findOne({ where: { id: scheduleData.userId } });
    }

    const foundSchedule: Schedule = await this.scheduleRepository.findOne({ where: { id: scheduleId } });
    foundSchedule.date = scheduleData.date;
    foundSchedule.shiftLength = scheduleData.shiftLength;
    foundSchedule.user = foundUser;

    await this.scheduleRepository.update(scheduleId, foundSchedule);
    return foundSchedule;
  }

  public async deleteSchedule(scheduleId: number): Promise<Schedule> {
    if (isNaN(scheduleId)) throw new HttpException(409, 'The schedule id is missing');

    const foundSchedule: Schedule = await this.scheduleRepository.findOne({ where: { id: scheduleId } });
    if (!foundSchedule) throw new HttpException(409, `There is no schedule with id ${scheduleId}`);

    await this.scheduleRepository.delete({ id: scheduleId });
    return foundSchedule;
  }
}
