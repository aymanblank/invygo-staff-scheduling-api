import request from 'supertest';
import App from '../app';
import { MySQLDataSource } from '../data/databases';
import { CreateScheduleDto, FilterScheduleDto } from '../api/dtos';
import { ScheduleRoute } from '../api/routes';
import { users, schedules } from './fixtures';
import moment from 'moment';

const scheduleData: CreateScheduleDto = {
  date: '2022-06-10',
  shiftLength: 8,
  userId: users[1].id,
};

let userRepositoryMock = null;
let scheduleRepositoryMock = null;

beforeAll(async () => {
  await MySQLDataSource.initialize();
});

afterAll(async () => {
  await MySQLDataSource.destroy();
});

describe('Testing User API', () => {
  beforeEach(() => {
    userRepositoryMock = {
      async findOne() {
        return users[1];
      },
    };
    scheduleRepositoryMock = {
      async findOne() {
        return schedules[0];
      },
      create() {
        return this;
      },
      async save() {
        return schedules[0];
      },
      async update() {
        return schedules[0];
      },
      createQueryBuilder() {
        return this;
      },
      leftJoinAndSelect() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      async getMany() {
        return schedules;
      },
      async findByIdWithRelations() {
        return schedules[0];
      },
    };
  });
  describe('[GET] /schedule', () => {
    it('should return a list of schedules', () => {
      const scheduleRoute = new ScheduleRoute();

      // Mocking an Admin user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .get(`${scheduleRoute.path}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            data: schedules,
            message: 'Get Schedules',
          });
        })
        .expect(200);
    });

    it('should refuse the request when endData is pass one year from now', () => {
      const scheduleRoute = new ScheduleRoute();

      const filters: FilterScheduleDto = {
        startDate: '2022-06-01',
        endDate: moment().add(1, 'year').add(1, 'month').format('YYYY-MM-DD'), // More than one year from now
        userId: users[1].id,
      };

      // Mocking an Admin user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .get(`${scheduleRoute.path}?endDate=${filters.endDate}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            message: `Sorry but you can only view schedules up to a year and your end date: ${filters.endDate} has past that`,
          });
        })
        .expect(400);
    });
  });

  describe('[GET] /schedule/:id', () => {
    it('should return the specified schedule by id', () => {
      const scheduleRoute = new ScheduleRoute();

      const scheduleId = 1;
      // Mocking an user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];
      userRepositoryMock.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .get(`${scheduleRoute.path}/${scheduleId}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            data: schedules[scheduleId - 1],
            message: 'Get Schedule',
          });
        })
        .expect(200);
    });
  });

  describe('[POST] /schedule', () => {
    it('should create a new schedule then return it with the response', () => {
      const scheduleRoute = new ScheduleRoute();

      // Mocking an ADMIN user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];
      userRepositoryMock.findByIdWithRelations = async () => users[0];

      scheduleRepositoryMock.save = jest.fn(async () => scheduleData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .post(`${scheduleRoute.path}`)
        .send(scheduleData)
        .expect(res => {
          expect(res.body).toEqual({
            data: scheduleData,
            message: 'Create Schedule',
          });
        })
        .expect(200);
    });

    it('should deny access to this route if logged in user is not an ADMIN', () => {
      const scheduleRoute = new ScheduleRoute();

      // Mocking an STAFF user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .post(`${scheduleRoute.path}`)
        .send(scheduleData)
        .expect(res => {
          expect(res.body).toEqual({
            message: 'You have no access to this api',
          });
        })
        .expect(403);
    });
  });

  describe('[PUT] /schedule/:id', () => {
    it('should update the specified schedule then return it with the response', () => {
      const scheduleRoute = new ScheduleRoute();

      const scheduleId = 1;
      // Mocking an ADMIN user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];
      userRepositoryMock.findByIdWithRelations = async () => users[0];

      scheduleRepositoryMock.update = jest.fn(async () => schedules[scheduleId - 1]);
      scheduleRepositoryMock.findOne = jest.fn(async () => schedules[scheduleId - 1]);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .put(`${scheduleRoute.path}/${scheduleId}`)
        .send(scheduleData)
        .expect(res => {
          expect(res.body).toEqual({
            data: schedules[scheduleId - 1],
            message: 'Update Schedule',
          });
        })
        .expect(200);
    });

    it('should deny access to this route if logged in user is not an ADMIN', () => {
      const scheduleRoute = new ScheduleRoute();

      const scheduleId = 1;
      // Mocking an STAFF user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .put(`${scheduleRoute.path}/${scheduleId}`)
        .send(scheduleData)
        .expect(res => {
          expect(res.body).toEqual({
            message: 'You have no access to this api',
          });
        })
        .expect(403);
    });
  });

  describe('[DELETE] /schedule/:id', () => {
    it('should delete the specified schedule then return it with the response', () => {
      const scheduleRoute = new ScheduleRoute();

      const scheduleId = 1;
      // Mocking an ADMIN user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];
      userRepositoryMock.findByIdWithRelations = async () => users[0];

      scheduleRepositoryMock.delete = jest.fn(async () => schedules[scheduleId - 1]);
      scheduleRepositoryMock.findOne = jest.fn(async () => schedules[scheduleId - 1]);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .delete(`${scheduleRoute.path}/${scheduleId}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            data: schedules[scheduleId - 1],
            message: 'Delete Schedule',
          });
        })
        .expect(200);
    });

    it('should deny access to this route if logged in user is not an ADMIN', () => {
      const scheduleRoute = new ScheduleRoute();

      const scheduleId = 1;
      // Mocking an STAFF user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.scheduleRepository = scheduleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      scheduleRoute.scheduleController.scheduleService.userRepository = userRepositoryMock;

      const app = new App([scheduleRoute]);
      return request(app.getServer())
        .delete(`${scheduleRoute.path}/${scheduleId}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            message: 'You have no access to this api',
          });
        })
        .expect(403);
    });
  });
});
