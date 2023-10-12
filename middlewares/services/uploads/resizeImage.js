import sharp from 'sharp';
import catchAsync from '../../utils/catchAsync.js';

export default (x, y) => {
  return catchAsync(async (req, res, next) => {
    // If No files

    if (Object.entries(req.files).length === 0) return next();

    // If Only profile photo uploaded
    if (!req.files.coverImage) {
      req.files.photo[0].filename = `profile-${req.params.userName.toLowerCase()}-${Date.now()}.jpeg`;

      await sharp(req.files.photo[0].buffer)
        .resize(x, y)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/${req.files.photo[0].filename}`);

      return next();
    }

    if (!req.files.photo) {
      req.files.coverImage[0].filename = `profile-${req.params.userName.toLowerCase()}-${Date.now()}.jpeg`;

      await sharp(req.files.coverImage[0].buffer)
        .resize(x, y)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/${req.files.coverImage[0].filename}`);

      return next();
    }

    // If Profile & Cover Photos Uploaded
    req.files.photo[0].filename = `profile-${req.params.userName.toLowerCase()}-${Date.now()}.jpeg`;
    req.files.coverImage[0].filename = `cover-${req.params.userName.toLowerCase()}-${Date.now()}.jpeg`;

    await Promise.all(
      [req.files.photo[0], req.files.coverImage[0]].map(async img => {
        await sharp(img.buffer)
          .resize(x, y)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/images/${img.filename}`);
      })
    );

    next();
  });
};
