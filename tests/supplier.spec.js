const app = require('../app');
const request = require('supertest');
const { suppliers } = require('../models');
const getAuthToken = require('../utils/getAuth.mock');

// mock sequelize
jest.mock('../models');

const mockSupplier = require('../utils/mocks/supplier.json');

// supplier test case
describe('SUPPLIER controller', () => {
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
    suppliers.findAll.mockResolvedValue(mockSupplier);

    try {
      const response = await request(app)
        .get('/supplier')
        .set('Authorization', `Bearer ${token}`);

      // short
      const supplied_components = response.body.data[0].supplied_components[0];
      const suppliers = response.body.data[0];

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(suppliers).toHaveProperty('uuid');
      expect(suppliers).toHaveProperty('name');
      expect(suppliers).toHaveProperty('address');
      expect(Array.isArray(response.body.data)).toBeTruthy();
      // supplied components
      expect(suppliers).toHaveProperty('supplied_components');
      expect(Array.isArray(suppliers.supplied_components)).toBeTruthy();
      expect(supplied_components).toHaveProperty('uuid');
      expect(supplied_components).toHaveProperty('name');
      expect(supplied_components).toHaveProperty('description');
      // component supplier uuid
      expect(supplied_components).toHaveProperty('component_suppliers');
      expect(supplied_components.component_suppliers).toHaveProperty('uuid');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('read success : get single data', async () => {
    // mock
    suppliers.findOne.mockResolvedValue(mockSupplier[0]);

    try {
      const response = await request(app)
        .get(`/supplier/${mockSupplier[0].uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // short
      const supplied_components = response.body.data.supplied_components[0];
      const supplier = response.body.data;

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(supplier).toHaveProperty('uuid');
      expect(supplier).toHaveProperty('name');
      expect(supplier).toHaveProperty('address');
      // supplied components
      expect(supplier).toHaveProperty('supplied_components');
      expect(Array.isArray(supplier.supplied_components)).toBeTruthy();
      expect(supplied_components).toHaveProperty('uuid');
      expect(supplied_components).toHaveProperty('name');
      expect(supplied_components).toHaveProperty('description');
      // component supplier uuid
      expect(supplied_components).toHaveProperty('component_suppliers');
      expect(supplied_components.component_suppliers).toHaveProperty('uuid');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('create success : create supplier', async () => {
    // mock
    suppliers.create.mockResolvedValue({
      uuid: mockSupplier[0].uuid,
      name: mockSupplier[0].name,
      address: mockSupplier[0].address,
    });

    try {
      const response = await request(app)
        .post(`/supplier`)
        .send({ name: mockSupplier[0].name, address: mockSupplier[0].address })
        .set('Authorization', `Bearer ${token}`);

      // short
      const suppliers = response.body.data;

      // expect response
      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('created!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(suppliers).toHaveProperty('uuid');
      expect(suppliers).toHaveProperty('name');
      expect(suppliers).toHaveProperty('address');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('create success : create store procurement data', async () => {
    // mock
    suppliers.bulkCreate.mockResolvedValue(1);

    try {
      const response = await request(app)
        .post(`/supplier/${mockSupplier[0].uuid}/components`)
        .send({
          components_uuid: [mockSupplier[0].supplied_components[0].uuid],
        })
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('components added!');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('update success : update data', async () => {
    // mock
    suppliers.update.mockResolvedValue({
      name: mockSupplier[0].name,
      address: mockSupplier[0].address,
    });

    try {
      const response = await request(app)
        .put(`/supplier/${mockSupplier[0].uuid}`)
        .send({ name: mockSupplier[0].name, address: mockSupplier[0].address })
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

  test('delete success : delete supplier', async () => {
    // mock
    suppliers.destroy.mockResolvedValue(1);

    try {
      const response = await request(app)
        .delete(`/supplier/${mockSupplier[0].uuid}`)
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

  test('delete success : delete procurement', async () => {
    // mock
    suppliers.destroy.mockResolvedValue(1);

    try {
      const supplied_component_uuid =
        mockSupplier[0].supplied_components[0].component_suppliers.uuid;

      const response = await request(app)
        .delete(`/supplier/supplied_component/${supplied_component_uuid}`)
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
  test('create failed : no provide data supplier', async () => {
    // mock
    suppliers.create.mockResolvedValue(mockSupplier);

    try {
      const response = await request(app)
        .post('/supplier')
        .send({})
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe('please provide name and address!');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('create failed : procurement data components_uuid not array', async () => {
    // mock
    suppliers.bulkCreate.mockResolvedValue(null);

    try {
      const response = await request(app)
        .post(`/supplier/${mockSupplier[0].uuid}/components`)
        .send({
          components_uuid: mockSupplier[0].uuid,
        })
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(`components_uuid must be array type!`);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('delete failed : supplier not found', async () => {
    // mock
    suppliers.destroy.mockResolvedValue(null);

    try {
      const response = await request(app)
        .delete(`/supplier/${mockSupplier[0].uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `can't find supplier with id ${mockSupplier[0].uuid}!`
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('delete failed : supplied components not found', async () => {
    // mock
    suppliers.destroy.mockResolvedValue(null);

    try {
      const supplied_component_uuid =
        mockSupplier[0].supplied_components[0].component_suppliers.uuid;

      const response = await request(app)
        .delete(`/supplier/supplied_component/${supplied_component_uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `can't find supplied_components with uuid ${supplied_component_uuid}!`
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('update failed : supplier not found', async () => {
    // mock
    suppliers.update.mockResolvedValue([0]);

    try {
      const response = await request(app)
        .put(`/supplier/${mockSupplier[0].uuid}`)
        .send({
          name: mockSupplier[0].name,
          address: mockSupplier[0].address,
        })
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `can't find supplier with uuid ${mockSupplier[0].uuid}!`
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });
});
