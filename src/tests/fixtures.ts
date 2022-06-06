import { faker } from '@faker-js/faker';
import { ROLES } from '../config';
export const roles = {
  ADMIN: {
    id: 2,
    name: 'ADMIN',
  },
  STAFF_USER: {
    id: 1,
    name: 'STAFF_USER',
  },
};

export const staffRole = {
  ...roles.STAFF_USER,
  permissions: ROLES.STAFF_USER.permissions,
};

export const users = [
  //ADMIN
  {
    id: 1,
    name: 'admin',
    email: 'admin@invygo.com',
    roleId: 2,
    password: 'password',
    role: {
      ...roles.ADMIN,
      permissions: ROLES.ADMIN.permissions,
    },
  },
  //STAFF USER
  {
    id: 2,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
  //STAFF USER
  {
    id: 3,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
  //STAFF USER
  {
    id: 4,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
  //STAFF USER
  {
    id: 5,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
  //STAFF USER
  {
    id: 6,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
  //STAFF USER
  {
    id: 7,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
  //STAFF USER
  {
    id: 8,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
  //STAFF USER
  {
    id: 9,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
  //STAFF USER
  {
    id: 10,
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleId: roles.STAFF_USER.id,
    password: faker.internet.password(),
    role: staffRole,
  },
];

export const usersWithAccumulatedWorkHours = [
  {
    id: 1,
    name: faker.name.findName(),
    accumulatedWorkHours: faker.finance.amount(1, 100, 0),
  },
  {
    id: 2,
    name: faker.name.findName(),
    accumulatedWorkHours: faker.finance.amount(1, 100, 0),
  },
  {
    id: 3,
    name: faker.name.findName(),
    accumulatedWorkHours: faker.finance.amount(1, 100, 0),
  },
  {
    id: 4,
    name: faker.name.findName(),
    accumulatedWorkHours: faker.finance.amount(1, 100, 0),
  },
  {
    id: 5,
    name: faker.name.findName(),
    accumulatedWorkHours: faker.finance.amount(1, 100, 0),
  },
  {
    id: 6,
    name: faker.name.findName(),
    accumulatedWorkHours: faker.finance.amount(1, 100, 0),
  },
  {
    id: 7,
    name: faker.name.findName(),
    accumulatedWorkHours: faker.finance.amount(1, 100, 0),
  },
];

// STAFF USER 1 SCHEDULES
export const schedules = [
  {
    id: 1,
    date: faker.date.soon().toDateString(),
    shiftLength: faker.finance.amount(6, 12, 0),
    userId: users[1].id,
    user: users[1],
  },
  {
    id: 2,
    date: faker.date.soon().toDateString(),
    shiftLength: faker.finance.amount(6, 12, 0),
    userId: users[1].id,
    user: users[1],
  },
  {
    id: 3,
    date: faker.date.soon().toDateString(),
    shiftLength: faker.finance.amount(6, 12, 0),
    userId: users[1].id,
    user: users[1],
  },
  {
    id: 4,
    date: faker.date.soon().toDateString(),
    shiftLength: faker.finance.amount(6, 12, 0),
    userId: users[1].id,
    user: users[1],
  },
  {
    id: 5,
    date: faker.date.soon().toDateString(),
    shiftLength: faker.finance.amount(6, 12, 0),
    userId: users[1].id,
    user: users[1],
  },
];
