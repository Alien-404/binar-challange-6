const app = require('../app');
const request = require('supertest');
const { components } = require('../models');
const getAuthToken = require('../utils/getAuth.mock');

// mock sequelize
jest.mock('../models');

const mockComponent = require('../utils/mocks/component.json');

// component test case
describe('COMPONENT controller', () => {
  let token;
  // clear all mock for first test
  beforeAll(async () => {
    token = await getAuthToken();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // positive test
  test('read success : get all data', async () => {
    // mock
    components.findAll.mockResolvedValue(mockComponent);

    try {
      const response = await request(app)
        .get('/component')
        .set('Authorization', `Bearer ${token}`);

      // short
      const component = response.body.data[0];

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(component).toHaveProperty('uuid');
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('description');
      expect(Array.isArray(response.body.data)).toBeTruthy();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('read success : get single data', async () => {
    // mock
    components.findOne.mockResolvedValue(mockComponent[0]);

    try {
      const response = await request(app)
        .get(`/component/${mockComponent[0].uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // short
      const supplier = response.body.data;

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(supplier).toHaveProperty('uuid');
      expect(supplier).toHaveProperty('name');
      expect(supplier).toHaveProperty('description');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('create success : create component', async () => {
    // mock
    components.create.mockResolvedValue({
      uuid: mockComponent[0].uuid,
      name: mockComponent[0].name,
      description: mockComponent[0].description,
    });

    try {
      const response = await request(app)
        .post(`/component`)
        .send({
          name: mockComponent[0].name,
          description: mockComponent[0].description,
        })
        .set('Authorization', `Bearer ${token}`);

      // short
      const component = response.body.data;

      // expect response
      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('created!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(component).toHaveProperty('uuid');
      expect(component).toHaveProperty('name');
      expect(component).toHaveProperty('description');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('update success : update data', async () => {
    // mock
    components.update.mockResolvedValue({
      name: mockComponent[0].name,
      description: mockComponent[0].description,
    });

    try {
      const response = await request(app)
        .put(`/component/${mockComponent[0].uuid}`)
        .send({
          name: mockComponent[0].name,
          description: mockComponent[0].description,
        })
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('delete success : delete component', async () => {
    // mock
    components.destroy.mockResolvedValue(1);

    try {
      const response = await request(app)
        .delete(`/component/${mockComponent[0].uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  // negative test
  test('create failed : no provide data component', async () => {
    // mock
    components.create.mockResolvedValue(mockComponent);

    try {
      const response = await request(app)
        .post('/component')
        .send({})
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        'please provide name and description!'
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('delete failed : component not found', async () => {
    // mock
    components.destroy.mockResolvedValue(null);

    try {
      const response = await request(app)
        .delete(`/component/${mockComponent[0].uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `can't find component with id ${mockComponent[0].uuid}!`
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('update failed : component not found', async () => {
    // mock
    components.update.mockResolvedValue([0]);

    try {
      const response = await request(app)
        .put(`/component/${mockComponent[0].uuid}`)
        .send({
          name: mockComponent[0].name,
          description: mockComponent[0].description,
        })
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `can't find component with uuid ${mockComponent[0].uuid}!`
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });
});
