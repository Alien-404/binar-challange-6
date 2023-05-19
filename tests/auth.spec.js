const app = require('../app');
const request = require('supertest');
const bcrypt = require('bcrypt');
const { User } = require('../models');

// mock sequelize
jest.mock('../models');

// users mock
const mockUser = require('../utils/mocks/user.json');

// auth test case
describe('AUTH controller', () => {
  // clear all mock for first test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // positive case
  test('register success!', async () => {
    // mock
    User.create.mockResolvedValue(mockUser);

    try {
      const response = await request(app).post('/auth/register').send(mockUser);

      // expect response
      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('user created!');
      expect(response.body.data).toHaveProperty('name', mockUser.name);
      expect(response.body.data).toHaveProperty('email', mockUser.email);
      expect(response.body.data).toStrictEqual({
        name: mockUser.name,
        email: mockUser.email,
      });
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('login success!', async () => {
    // mock
    const hashPassword = await bcrypt.hash(
      mockUser.password,
      await bcrypt.genSalt(10)
    );
    User.findOne.mockResolvedValue({
      email: mockUser.email,
      password: hashPassword,
    });

    try {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: mockUser.email, password: mockUser.password });

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body.data).toHaveProperty('token');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  // negative case
  test('register failed! : without send user data', async () => {
    try {
      const response = await request(app).post('/auth/register').send({});

      // expect response
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        'please provide name, email and password!'
      );
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('register failed! : credential already exist', async () => {
    // mock
    User.findOne.mockResolvedValue(mockUser);

    try {
      const response = await request(app).post('/auth/register').send({
        name: 'test2',
        email: mockUser.email,
        password: 'qwerty123',
      });

      // expect response
      expect(response.status).toBe(409);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `user with ${mockUser.email} already exist!`
      );
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('login failed! : without send user credentials', async () => {
    try {
      const response = await request(app).post('/auth/login').send();

      // expect response
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(`please provide email and password!`);
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('login failed! : credential not registered', async () => {
    // mock
    User.findOne.mockResolvedValue(null);
    try {
      const response = await request(app).post('/auth/login').send(mockUser);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(`credential not found!`);
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('login failed! : wrong credential password', async () => {
    // mock
    User.findOne.mockResolvedValue(mockUser);
    try {
      const response = await request(app).post('/auth/login').send(mockUser);

      // expect response
      expect(response.status).toBe(401);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(`credential not valid!`);
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });
});
