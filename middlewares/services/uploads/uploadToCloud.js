import { UploadClient } from '@uploadcare/upload-client';
import catchAsync from '../../utils/catchAsync.js';
import { fileInfo, UploadcareSimpleAuthSchema } from '@uploadcare/rest-client';

const client = new UploadClient({ publicKey: process.env.IMAGES_CLOUD_API });

export default catchAsync(async (req, res, next) => {
  // If no photo or cover image

  if (Object.entries(req.files).length === 0) return next();

  // If Only profile photo uploaded
  if (!req.files.coverImage) {
    const file = await client.uploadFile(req.files.photo[0].buffer, {
      fileName: req.files.photo[0].filename,
    });

    req.userProfileImage = file.cdnUrl + '-/preview/500x500/';
    return next();
  }

  if (!req.files.photo) {
    const file = await client.uploadFile(req.files.coverImage[0].buffer, {
      fileName: req.files.coverImage[0].filename,
    });

    req.userCoverImage = file.cdnUrl + '-/preview/500x500/';
    return next();
  }
  // If Profile & Cover Photos Uploaded
  await Promise.all(
    [req.files.photo[0], req.files.coverImage[0]].map(async (img, index) => {
      const result = await client.uploadFile(img.buffer, {
        fileName: img.filename,
      });

      index == 0
        ? (req.userProfileImage = result.cdnUrl + '-/preview/500x500/')
        : (req.userCoverImage = result.cdnUrl + '-/preview/500x500/');
    })
  );
  // const file = await client.uploadFile(req.file.buffer, {
  //   fileName: req.file.filename,
  // });

  // requestImageFromCloud(file.uuid);
  // req.userImage = file.cdnUrl + '-/preview/500x500/';

  next();
});

// const requestImageFromCloud = async uuid => {
//   const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
//     publicKey: '26903a2cfd3d36541974',
//     secretKey: '1fd2a744cd6ae3ba25e0',
//   });

//   const result = await fileInfo(
//     {
//       uuid,
//     },
//     { authSchema: uploadcareSimpleAuthSchema }
//   );
//   console.log(result);
// };
