import bcrypt from 'bcryptjs';
import request from 'supertest';
import App from '../app';
import { MySQLDataSource } from '../data/databases';
import { CreateUserDto, LoginUserDto } from '../api/dtos';
import { AuthRoute } from '../api/routes';

let userData: CreateUserDto = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'q1w2e3r4!',
};

const loginData: LoginUserDto = {
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

describe('Testing Auth API', () => {
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
    };
    roleRepositoryMock = {
      async findOne() {
        return {
          id: 1,
          name: 'STAFF_USER',
        };
      },
      create() {
        return this;
      },
      async save() {
        return null;
      },
    };
  });
  describe('[POST] /signup', () => {
    it('should register a new user when email is not found', () => {
      const authRoute = new AuthRoute();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.roleRepository = roleRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.userRepository = userRepositoryMock;

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(201);
    });

    it('should refuse registration when email already exists', async () => {
      userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'q1w2e3r4!',
      };

      const authRoute = new AuthRoute();

      userRepositoryMock.findOne = async () => ({
        id: 1,
        name: userData.name,
        email: userData.email,
        roleId: 2,
        password: await bcrypt.hash(userData.password, 10),
      });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.userRepository = userRepositoryMock;

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}signup`).send(userData).expect(409);
    });

    it('should respond with a new user object if registration succeeds', async () => {
      userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'q1w2e3r4!',
      };
      const response = {
        data: {
          id: 1,
          name: userData.name,
          email: userData.email,
          roleId: 2,
          password: await bcrypt.hash(userData.password, 10),
        },
        message: 'signup',
      };

      const authRoute = new AuthRoute();
      userRepositoryMock = {
        ...userRepositoryMock,
        async findOne() {
          return null;
        },
      };
      userRepositoryMock.save = jest.fn(async () => ({ ...response.data }));
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.userRepository = userRepositoryMock;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.roleRepository = roleRepositoryMock;

      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}signup`)
        .send(userData)
        .expect(res => expect(res.body).toEqual(response))
        .expect(201);
    });
  });

  describe('[POST] /login', () => {
    it('should refuse to login when the user email is not found in the system', () => {
      const authRoute = new AuthRoute();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.userRepository = userRepositoryMock;

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}login`).send(loginData).expect(409);
    });

    it('should refuse to login when the user login data is missing', () => {
      const authRoute = new AuthRoute();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.userRepository = userRepositoryMock;

      const app = new App([authRoute]);
      return request(app.getServer()).post(`${authRoute.path}login`).send({}).expect(400);
    });

    it('should refuse to login when the user login email is empty', () => {
      const authRoute = new AuthRoute();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.userRepository = userRepositoryMock;

      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}login`)
        .send({ ...loginData, email: '' })
        .expect(res => {
          expect(res.body).toEqual({ message: 'email must be an email' });
        })
        .expect(400);
    });

    it("should refuse to login when the user login password does't match with the one in the system", () => {
      const authRoute = new AuthRoute();

      userRepositoryMock.findOne = jest.fn(async () => ({
        id: 1,
        name: userData.name,
        email: userData.email,
        roleId: 2,
        password: await bcrypt.hash(userData.password, 10),
      }));

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.userRepository = userRepositoryMock;

      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}login`)
        .send({ ...loginData, password: 'dummy' })
        .expect(res => {
          expect(res.body).toEqual({ message: 'Your password is incorrect' });
        })
        .expect(409);
    });

    it('should login successfully when the user login data is correct', async () => {
      const authRoute = new AuthRoute();

      const mockedDBUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        password: await bcrypt.hash(userData.password, 10),
        createdAt: '2022-06-05T09:22:23.672Z',
        updatedAt: '2022-06-05T09:22:23.672Z',
      };

      userRepositoryMock.findOne = jest.fn(async () => mockedDBUser);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      authRoute.authController.authService.userRepository = userRepositoryMock;

      const app = new App([authRoute]);
      return request(app.getServer())
        .post(`${authRoute.path}login`)
        .send(loginData)
        .expect(res => {
          expect(res.body).toEqual({
            data: {
              tokenData: {
                expiresIn: 3600,
                token: expect.any(String),
              },
              user: {
                ...mockedDBUser,
              },
            },
            message: 'login',
          });
        })
        .expect(200);
    });
  });
});
