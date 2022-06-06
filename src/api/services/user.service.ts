import { hash } from 'bcryptjs';
import { CreateUserDto, FilterUserDto } from '../dtos';
import { UserRepository, RoleRepository } from '../../data/repositories';
import { HttpException } from '../exceptions';
import { User, Role, UserWithAccumulatedWorkHours } from '../../interfaces';
import { isEmpty, isNaN, isNull, isUndefined } from 'underscore';
import { ScheduleEntity } from '../../data/entities';
import moment from 'moment';

export class UserService {
  public userRepository = UserRepository;
  public roleRepository = RoleRepository;

  public async findUserById(userId: number): Promise<User> {
    if (isNaN(userId)) throw new HttpException(409, 'The user id is missing');

    const foundUser: User = await this.userRepository.findByIdWithRelations(userId);
    return foundUser;
  }

  public async findAllUsers(): Promise<User[]> {
    const users: User[] = await this.userRepository.find();
    return users;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isNull(userData)) throw new HttpException(400, 'Some of the user data fields are missing');
    if (isEmpty(userData?.name)) throw new HttpException(409, 'The name field is missing');
    if (isEmpty(userData?.email)) throw new HttpException(409, 'The email field is missing');
    if (isEmpty(userData?.password)) throw new HttpException(409, 'The password field is missing');

    const foundUser: User = await this.userRepository.findOne({ where: { name: userData.name, email: userData.email } });
    if (foundUser) throw new HttpException(409, `The email ${userData.email} already exists`);

    const foundRole: Role = await this.roleRepository.findOne({ where: { id: userData.roleId } });
    if (!foundRole) throw new HttpException(409, `There is no role with the id ${userData.roleId}`);

    const hashedPassword = await hash(userData.password, 10);
    const createdUser: User = await this.userRepository.create({ ...userData, password: hashedPassword, role: foundRole }).save();
    return createdUser;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    if (isNull(userData)) throw new HttpException(400, 'Some of the user data fields are missing');
    if (isNaN(userId)) throw new HttpException(409, 'The user id is missing');
    if (isEmpty(userData?.name)) throw new HttpException(409, 'The name field is missing');
    if (isEmpty(userData?.email)) throw new HttpException(409, 'The email field is missing');
    if (isEmpty(userData?.password)) throw new HttpException(409, 'The password field is missing');

    const hashedPassword = await hash(userData.password, 10);

    const foundUser: User = await this.userRepository.findOne({ where: { id: userId } });
    foundUser.name = userData.name;
    foundUser.email = userData.email;
    foundUser.password = hashedPassword;

    await this.userRepository.update(userId, foundUser);
    return foundUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    if (isNaN(userId)) throw new HttpException(409, 'The user id is missing');

    const foundUser: User = await this.userRepository.findOne({ where: { id: userId } });
    if (!foundUser) throw new HttpException(409, `There is no user with id ${userId}`);

    await this.userRepository.delete({ id: userId });
    return foundUser;
  }

  public async findUsersListByAccumulatedWorkHours(userFilters: FilterUserDto): Promise<UserWithAccumulatedWorkHours[]> {
    // Set a flag to determine if the query has filters or not
    let withFilters = false;
    // Initiate a query builder
    let query = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect(ScheduleEntity, 'schedule', 'schedule.userId = user.id')
      .select('user.id', 'id')
      .addSelect('user.name', 'name')
      .addSelect('SUM(schedule.shiftLength)', 'accumulatedWorkHours')
      .groupBy('user.id');
    // Check if we got filters or not
    if (!isUndefined(userFilters) && !isEmpty(userFilters)) {
      // Add start date filter to the query if it exists
      if (!isEmpty(userFilters.startDate)) {
        const startDate = moment(userFilters.startDate).format('YYYY-MM-DD');
        query = query.where('schedule.date >= :startDate', { startDate: startDate });
        withFilters = true;
      }
      // Add end date filter to the query if it exists
      if (!isEmpty(userFilters.endDate)) {
        const endDate = moment(userFilters.endDate).format('YYYY-MM-DD');
        // Handle the up to 1 year condition
        if (moment(endDate).isAfter(moment().add(1, 'year'))) {
          throw new HttpException(
            400,
            `Sorry but you can only list users accumulated work hours up to a year and your end date: ${endDate} has past that`,
          );
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
    }
    let users: UserWithAccumulatedWorkHours[] = [];
    // Run the query
    if (withFilters) {
      users = await query.getRawMany();
    } else {
      users = await query.where('date < :dateValue', { dateValue: moment().add(1, 'year').format('YYYY-MM-DD') }).getRawMany();
    }
    return users;
  }
}
