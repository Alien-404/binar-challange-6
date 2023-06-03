'use strict';
const { Role, Module } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // get admin role id
    const adminRole = await Role.findOne({
      where: { name: 'Admin' },
    });
    const userRole = await Role.findOne({
      where: { name: 'User' },
    });

    // module id
    const authModule = await Module.findOne({
      where: { name: 'Authorization' },
    });

    await queryInterface.bulkInsert('RoleAccesses', [
      {
        role_id: adminRole.id,
        module_id: authModule.id,
        is_read: true,
        is_write: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role_id: userRole.id,
        module_id: authModule.id,
        is_read: true,
        is_write: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('RoleAccesses', null, {});
  },
};
