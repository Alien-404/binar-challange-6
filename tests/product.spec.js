const app = require('../app');
const request = require('supertest');
const { products, components } = require('../models');
const getAuthToken = require('../utils/getAuth.mock');

// mock sequelize
jest.mock('../models');

const mockProduct = require('../utils/mocks/product.json');

describe('PRODUCT controller', () => {
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
    products.findAll.mockResolvedValue(mockProduct);

    try {
      const response = await request(app)
        .get('/product')
        .set('Authorization', `Bearer ${token}`);

      // short
      const components_used = response.body.data[0].components_used[0];
      const product = response.body.data[0];

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(product).toHaveProperty('uuid');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('quantity');
      expect(Array.isArray(response.body.data)).toBeTruthy();
      // components used
      expect(product).toHaveProperty('components_used');
      expect(Array.isArray(product.components_used)).toBeTruthy();
      expect(components_used).toHaveProperty('uuid');
      expect(components_used).toHaveProperty('name');
      expect(components_used).toHaveProperty('description');
      // product components uuid
      expect(components_used).toHaveProperty('product_components');
      expect(components_used.product_components).toHaveProperty('uuid');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('read success : get single data', async () => {
    // mock
    products.findOne.mockResolvedValue(mockProduct[0]);

    try {
      const response = await request(app)
        .get(`/product/${mockProduct[0].uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // short
      const components_used = response.body.data.components_used[0];
      const product = response.body.data;

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('success!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(product).toHaveProperty('uuid');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('quantity');
      // product components
      expect(product).toHaveProperty('components_used');
      expect(Array.isArray(product.components_used)).toBeTruthy();
      expect(components_used).toHaveProperty('uuid');
      expect(components_used).toHaveProperty('name');
      expect(components_used).toHaveProperty('description');
      // component product uuid
      expect(components_used).toHaveProperty('product_components');
      expect(components_used.product_components).toHaveProperty('uuid');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('create success : create product', async () => {
    // mock
    products.create.mockResolvedValue({
      uuid: mockProduct[0].uuid,
      name: mockProduct[0].name,
      quantity: mockProduct[0].quantity,
    });

    try {
      const response = await request(app)
        .post(`/product`)
        .send({
          name: mockProduct[0].name,
          quantity: mockProduct[0].quantity,
          components_name: [mockProduct[0].components_used[0].name],
        })
        .set('Authorization', `Bearer ${token}`);

      // short
      const product = response.body.data;

      // expect response
      expect(response.status).toBe(201);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('created!');
      expect(response.body).toHaveProperty('data');

      // data property
      expect(product).toHaveProperty('uuid');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('quantity');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('create success : create product components', async () => {
    // mock
    products.findOne.mockResolvedValue(mockProduct);

    try {
      const response = await request(app)
        .post(`/product/${mockProduct[0].uuid}/components`)
        .send({
          components_name: [mockProduct[0].components_used[0].name],
        })
        .set('Authorization', `Bearer ${token}`);

      // short
      const components_used = response.body.data[0].components_used[0];
      const product = response.body.data[0];

      // expect response
      expect(response.status).toBe(200);
      expect(response.body.status).toBe(true);
      expect(response.body.message).toBe('added!');
      expect(response.body).toHaveProperty('data');
      // data property
      expect(product).toHaveProperty('uuid');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('quantity');
      expect(Array.isArray(response.body.data)).toBeTruthy();
      // components used
      expect(product).toHaveProperty('components_used');
      expect(Array.isArray(product.components_used)).toBeTruthy();
      expect(components_used).toHaveProperty('uuid');
      expect(components_used).toHaveProperty('name');
      expect(components_used).toHaveProperty('description');
      // product components uuid
      expect(components_used).toHaveProperty('product_components');
      expect(components_used.product_components).toHaveProperty('uuid');
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('update success : update data', async () => {
    // mock
    products.update.mockResolvedValue({
      name: mockProduct[0].name,
      quantity: mockProduct[0].quantity,
    });

    try {
      const response = await request(app)
        .put(`/product/${mockProduct[0].uuid}`)
        .send({ name: mockProduct[0].name, quantity: mockProduct[0].quantity })
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

  test('delete success : delete product', async () => {
    // mock
    products.destroy.mockResolvedValue(1);

    try {
      const response = await request(app)
        .delete(`/product/${mockProduct[0].uuid}`)
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

  test('delete success : delete product component', async () => {
    // mock
    products.destroy.mockResolvedValue(1);

    try {
      const product_component_uuid =
        mockProduct[0].components_used[0].product_components.uuid;

      const response = await request(app)
        .delete(`/product/components_used/${product_component_uuid}`)
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
  test('create failed : no provide data product', async () => {
    // mock
    products.create.mockResolvedValue(mockProduct);

    try {
      const response = await request(app)
        .post('/product')
        .send({})
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(400);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        'please provide name, quantity, and components_name(array)!'
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('create failed : no provide any component name', async () => {
    // mock
    components.findAll.mockResolvedValue([]);

    try {
      const response = await request(app)
        .post(`/product`)
        .send({
          name: mockProduct[0].name,
          quantity: mockProduct[0].quantity,
          components_name: [],
        })
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        'please enter the registered component name at least 1!'
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('delete failed : product not found', async () => {
    // mock
    products.destroy.mockResolvedValue(null);

    try {
      const response = await request(app)
        .delete(`/product/${mockProduct[0].uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `can't find product with id ${mockProduct[0].uuid}!`
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('delete failed : product component not found', async () => {
    // mock
    products.destroy.mockResolvedValue(null);

    try {
      const product_component_uuid =
        mockProduct[0].components_used[0].product_components.uuid;

      const response = await request(app)
        .delete(`/product/components_used/${product_component_uuid}`)
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `can't find product component with id ${product_component_uuid}!`
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });

  test('update failed : product not found', async () => {
    // mock
    products.update.mockResolvedValue([0]);

    try {
      const response = await request(app)
        .put(`/supplier/${mockProduct[0].uuid}`)
        .send({
          name: mockProduct[0].name,
          quantity: mockProduct[0].quantity,
        })
        .set('Authorization', `Bearer ${token}`);

      // expect response
      expect(response.status).toBe(404);
      expect(response.body.status).toBe(false);
      expect(response.body.message).toBe(
        `can't find supplier with uuid ${mockProduct[0].uuid}!`
      );
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toBeNull();
    } catch (error) {
      expect(error).toBe('error');
    }
  });
});
