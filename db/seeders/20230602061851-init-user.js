'use strict';
const bcrypt = require('bcrypt');
const { Role } = require('../models');
const uuid = require('uuid');
const { DEFAULT_PROFILE_URL, DEFAULT_ADMIN_PASSWORD } = process.env;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashPassword = await bcrypt.hash(
      DEFAULT_ADMIN_PASSWORD || 'rahasia',
      await bcrypt.genSalt(10)
    );
    // get admin role id
    const adminRole = await Role.findOne({
      where: { name: 'Admin' },
    });

    await queryInterface.bulkInsert('Users', [
      {
        uuid: uuid.v4(),
        name: 'admin',
        email: 'admin@gmail.com',
        password: hashPassword,
        role_id: adminRole.id,
        user_type: 'seed',
        profile_url: DEFAULT_PROFILE_URL,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
