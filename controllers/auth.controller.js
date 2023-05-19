const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// environments
const { SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // check user have send data in body
      if (!name || !email || !password) {
        return res.status(400).json({
          status: false,
          message: 'please provide name, email and password!',
          data: null,
        });
      }

      // check user email already exist or not
      const isEmail = await User.findOne({
        where: {
          email,
        },
      });

      if (isEmail) {
        return res.status(409).json({
          status: false,
          message: `user with ${email} already exist!`,
          data: null,
        });
      }

      // hash password
      const hashPassword = await bcrypt.hash(
        password,
        await bcrypt.genSalt(10)
      );

      // store to database
      await User.create({ name, email, password: hashPassword });

      res.status(201).json({
        status: true,
        message: 'user created!',
        data: {
          name,
          email,
        },
      });
    } catch (err) {
      next(err.message);
    }
  },
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // check user have send data in body
      if (!email || !password) {
        return res.status(400).json({
          status: false,
          message: 'please provide email and password!',
          data: null,
        });
      }

      // get user data
      const isUser = await User.findOne({
        where: { email },
      });

      if (!isUser) {
        return res.status(404).json({
          status: false,
          message: `credential not found!`,
          data: null,
        });
      }

      // check user password
      const isPasswordValid = await bcrypt.compare(password, isUser.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          status: false,
          message: 'credential not valid!',
          data: null,
        });
      }

      // generate jwt token
      const payload = {
        uuid: isUser.uuid,
        name: isUser.name,
        email: isUser.email,
      };
      const options = {
        expiresIn: '3h',
      };

      const token = jwt.sign(payload, SECRET_KEY, options);

      res.status(200).json({
        status: true,
        message: 'success!',
        data: { token },
      });
    } catch (err) {
      next(err);
    }
  },
};
