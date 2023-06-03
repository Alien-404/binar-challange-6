const { User, Role } = require('../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const oauth2 = require('../utils/oauth2');
const nodemailer = require('../utils/nodemailer');

// environments
const { SECRET_KEY, DEFAULT_PROFILE_URL } = process.env;

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

      // get role
      const userRole = await Role.findOne({ where: { name: 'User' } });

      // Generate activation token
      const activationToken = jwt.sign({ email }, SECRET_KEY, {
        expiresIn: '3h',
      });

      // Set activation expiration time to 3 hours from now
      const activationExpires = new Date(Date.now() + 3 * 60 * 60 * 1000);

      // store to database
      await User.create({
        name,
        email,
        password: hashPassword,
        role_id: userRole.id,
        user_type: 'basic',
        profile_url: DEFAULT_PROFILE_URL,
        activationExpires,
        activationToken,
        isActive: false,
      });

      // send email verify
      const verify_url = `${req.protocol}://${req.get(
        'host'
      )}/auth/activate?token=${activationToken}`;

      const html = await nodemailer.getHtml('verify-message.ejs', {
        user: { name: name, verify_url: verify_url },
      });
      nodemailer.sendEmail(
        email,
        'Welcome to Manufaktur Binar API! Please Verify Your Email',
        html
      );

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

      // check user is verified or not
      if (!isUser.isActive) {
        return res.status(401).json({
          status: false,
          message: 'please activate the account first!',
          data: null,
        });
      }

      // generate jwt token
      const payload = {
        uuid: isUser.uuid,
        name: isUser.name,
        email: isUser.email,
        role_id: isUser.role_id,
        profile_url: isUser.profile_url,
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

  googleOauth2: async (req, res, next) => {
    try {
      const { code } = req.query;
      if (!code) {
        const googleLoginUrl = oauth2.generateAuthUrl();
        return res.redirect(googleLoginUrl);
      }

      await oauth2.setCreadentials(code);
      const { data } = await oauth2.getUserData();

      let user = await User.findOne({ where: { email: data.email } });

      if (!data.verified_email) {
        return res.status(401).json({
          status: false,
          message: `please using verified email!`,
          data: null,
        });
      }

      // get role
      const userRole = await Role.findOne({ where: { name: 'User' } });

      if (!user) {
        user = await User.create({
          name: data.name,
          email: data.email,
          role_id: userRole.id,
          user_type: 'google',
          profile_url: data.picture,
          isActive: true,
        });

        // send email success
        const html = await nodemailer.getHtml('welcome-message.ejs', {
          user: { name: data.name },
        });
        nodemailer.sendEmail(
          data.email,
          'Welcome to Manufaktur Binar API!',
          html
        );
      }

      const payload = {
        uuid: user.uuid,
        name: user.name,
        role_id: user.role_id,
        email: user.email,
        profile_url: user.profile_url,
      };

      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });
      return res.status(200).json({
        status: true,
        message: 'login success!',
        data: {
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  activateUser: async (req, res, next) => {
    try {
      const { token } = req.query || 'notfound';
      const parts = token.split('.');

      // check token
      if (!token || parts.length !== 3) {
        return res.redirect('/');
      }

      // extract token
      const data = jwt.verify(token, SECRET_KEY);

      // check expired token
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (data.exp < currentTimestamp) {
        return res.redirect('/');
      }

      const isUser = await User.findOne({
        where: {
          email: data.email,
          activationToken: token,
          isActive: false,
        },
      });

      // if have user
      if (isUser) {
        // update isActive to true
        await User.update(
          { isActive: true },
          {
            where: {
              email: data.email,
            },
          }
        );

        // send email success
        const htmlSuccess = await nodemailer.getHtml('welcome-message.ejs', {
          user: { name: isUser.name },
        });
        nodemailer.sendEmail(
          data.email,
          'Welcome to Manufaktur Binar API!',
          htmlSuccess
        );

        // render html success
        return res.render('template/auth/account-activation');
      }

      return res.redirect('/');
    } catch (error) {
      next(error);
    }
  },

  whoami: async (req, res, next) => {
    try {
      return res.status(200).json({
        status: true,
        message: 'fetch user success!',
        data: {
          uuid: req.user.uuid,
          name: req.user.name,
          email: req.user.email,
          role_id: req.user.role_id,
          profile_url: req.user.profile_url,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
