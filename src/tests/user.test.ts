import bcrypt from 'bcryptjs';
import request from 'supertest';
import App from '../app';
import { MySQLDataSource } from '../data/databases';
import { CreateUserDto, FilterUserDto } from '../api/dtos';
import { UserRoute } from '../api/routes';
import { roles, users, usersWithAccumulatedWorkHours } from './fixtures';
import moment from 'moment';

const userData: CreateUserDto = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'q1w2e3r4!',
};

let userRepositoryMock = null;
let roleRepositoryMock = null;

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
        return null;
      },
      create() {
        return this;
      },
      async save() {
        return {
          id: 1,
          name: userData.name,
          email: userData.email,
          roleId: 2,
          password: await bcrypt.hash(userData.password, 10),
        };
      },
      async find() {
        return users;
      },
      createQueryBuilder() {
        return this;
      },
      leftJoinAndSelect() {
        return this;
      },
      select() {
        return this;
      },
      addSelect() {
        return this;
      },
      groupBy() {
        return this;
      },
      where() {
        return this;
      },
      andWhere() {
        return this;
      },
      getRawMany() {
        return usersWithAccumulatedWorkHours;
      },
    };
    roleRepositoryMock = {
      async findOne() {
        return roles.ADMIN;
      },
      create() {
        return this;
      },
      async save() {
        return null;
      },
    };
  });
  describe('[GET] /user', () => {
    it('should return a list of users', () => {
      const userRoute = new UserRoute();

      // Mocking an Admin user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .get(`${userRoute.path}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            data: users,
            message: 'Get Users',
          });
        })
        .expect(200);
    });

    it('should deny access to this route if logged in user is not an ADMIN', () => {
      const userRoute = new UserRoute();

      // Mocking an STAFF user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .get(`${userRoute.path}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            message: 'You have no access to this api',
          });
        })
        .expect(403);
    });
  });

  describe('[GET] /user/:id', () => {
    it('should return the specified user by id', () => {
      const userRoute = new UserRoute();

      const userId = 2;
      // Mocking an user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[userId - 1];
      userRepositoryMock.findByIdWithRelations = async () => users[userId - 1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .get(`${userRoute.path}/${userId}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            data: users[userId - 1],
            message: 'Get User',
          });
        })
        .expect(200);
    });
  });

  describe('[GET] /user/list-by-accumulated-work-hours', () => {
    it('should return a list of users with their accumulated work hours', () => {
      const userRoute = new UserRoute();

      // Mocking an ADMIN user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];
      userRepositoryMock.findByIdWithRelations = async () => users[0];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .get(`${userRoute.path}/list-by-accumulated-work-hours`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            data: usersWithAccumulatedWorkHours,
            message: 'Get Users List By Accumulated Work Hours',
          });
        })
        .expect(200);
    });

    it('should refuse the request when endData is pass one year from now', () => {
      const userRoute = new UserRoute();

      const filters: FilterUserDto = {
        startDate: '2022-06-01',
        endDate: moment().add(1, 'year').add(1, 'month').format('YYYY-MM-DD'), // More than one year from now
        order: 'ascending',
      };

      // Mocking an ADMIN user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];
      userRepositoryMock.findByIdWithRelations = async () => users[0];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .get(`${userRoute.path}/list-by-accumulated-work-hours?endDate=${filters.endDate}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            message: `Sorry but you can only list users accumulated work hours up to a year and your end date: ${filters.endDate} has past that`,
          });
        })
        .expect(400);
    });

    it('should deny access to this route if logged in user is not an ADMIN', () => {
      const userRoute = new UserRoute();

      // Mocking an STAFF user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .get(`${userRoute.path}/list-by-accumulated-work-hours`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            message: 'You have no access to this api',
          });
        })
        .expect(403);
    });
  });

  describe('[POST] /user', () => {
    it('should create a new user then return it with the response', () => {
      const userRoute = new UserRoute();

      // Mocking an ADMIN user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];
      userRepositoryMock.findByIdWithRelations = async () => users[0];

      userRepositoryMock.save = jest.fn(async () => userData);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .post(`${userRoute.path}`)
        .send(userData)
        .expect(res => {
          expect(res.body).toEqual({
            data: userData,
            message: 'Create User',
          });
        })
        .expect(200);
    });

    it('should deny access to this route if logged in user is not an ADMIN', () => {
      const userRoute = new UserRoute();

      // Mocking an STAFF user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .post(`${userRoute.path}`)
        .send(userData)
        .expect(res => {
          expect(res.body).toEqual({
            message: 'You have no access to this api',
          });
        })
        .expect(403);
    });
  });

  describe('[PUT] /user/:id', () => {
    it('should update the specified user then return it with the response', () => {
      const userRoute = new UserRoute();

      const userId = 2;
      // Mocking an ADMIN user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];
      userRepositoryMock.findByIdWithRelations = async () => users[0];

      userRepositoryMock.update = jest.fn(async () => users[userId - 1]);
      userRepositoryMock.findOne = jest.fn(async () => users[userId - 1]);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .put(`${userRoute.path}/${userId}`)
        .send(userData)
        .expect(res => {
          expect(res.body).toEqual({
            data: users[userId - 1],
            message: 'Update User',
          });
        })
        .expect(200);
    });

    it('should deny access to this route if logged in user is not an ADMIN', () => {
      const userRoute = new UserRoute();

      const userId = 2;
      // Mocking an STAFF user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .put(`${userRoute.path}/${userId}`)
        .send(userData)
        .expect(res => {
          expect(res.body).toEqual({
            message: 'You have no access to this api',
          });
        })
        .expect(403);
    });
  });

  describe('[DELETE] /user/:id', () => {
    it('should delete the specified user then return it with the response', () => {
      const userRoute = new UserRoute();

      const userId = 2;
      // Mocking an ADMIN user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[0];
      userRepositoryMock.findByIdWithRelations = async () => users[0];

      userRepositoryMock.delete = jest.fn(async () => users[userId - 1]);
      userRepositoryMock.findOne = jest.fn(async () => users[userId - 1]);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .delete(`${userRoute.path}/${userId}`)
        .send()
        .expect(res => {
          expect(res.body).toEqual({
            data: users[userId - 1],
            message: 'Delete User',
          });
        })
        .expect(200);
    });

    it('should deny access to this route if logged in user is not an ADMIN', () => {
      const userRoute = new UserRoute();

      const userId = 2;
      // Mocking an STAFF user
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.authMW.userRepository.findByIdWithRelations = async () => users[1];

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      userRoute.userController.userService.userRepository = userRepositoryMock;

      const app = new App([userRoute]);
      return request(app.getServer())
        .delete(`${userRoute.path}/${userId}`)
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
