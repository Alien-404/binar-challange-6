const imagekit = require('../config/imagekit.config');
const { User } = require('../db/models');

module.exports = {
  imagekitUpload: async (req, res, next) => {
    try {
      const stringFile = req.file.buffer.toString('base64');
      const user = req.user;

      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        folder: `manufaktur/profile/${user.uuid}`,
        file: stringFile,
      });

      // update user
      await User.update(
        { profile_url: uploadFile.url },
        {
          where: {
            uuid: user.uuid,
          },
        }
      );

      return res.json({
        status: true,
        message: 'success update profile picture!',
        data: null,
      });
    } catch (err) {
      next(err);
    }
  },
};
