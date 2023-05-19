const app = require('../app');
const request = require('supertest');
const { User } = require('../models');
const bcrypt = require('bcrypt');

// Mock user data
const mockUser = require('./mocks/user.json');

const getAuthToken = async () => {
  const hashPassword = await bcrypt.hash(
    mockUser.password,
    await bcrypt.genSalt(10)
  );

  // Mock User.findOne to resolve with the mock user
  User.findOne.mockResolvedValue({
    email: mockUser.email,
    password: hashPassword,
  });

  // Make a request to the login endpoint with the mock credentials
  const response = await request(app).post('/auth/login').send(mockUser);

  // Return the token from the login response
  return response.body.data.token;
};

module.exports = getAuthToken;
