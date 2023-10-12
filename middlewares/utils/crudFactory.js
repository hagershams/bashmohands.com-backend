import Response from './response.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from './appError.js';

class Crud {
  constructor(Model) {
    this.Model = Model;
  }

  //   Get ALl Docs
  getAll = () =>
    catchAsync(async (req, res, next) => {
      const docs = await this.Model.find({}, '-password -createdAt -changedAt');

      // No docs
      if (!docs) return Response(res, `No ${this.Model.modelName}`, 200, {});

      //   Docs has founded
      Response(res, `${this.Model.modelName}`, 200, docs);
    });

  // Get One Doc
  getOne = () =>
    catchAsync(async (req, res, next) => {
      const doc = await this.Model.findById(
        req.params.id,
        '-password -createdAt -changedAt'
      );

      //   No Doc
      if (!doc) return next(new AppError(`No ${this.Model.modelName} Found!`));

      //   Doc has found
      Response(res, `${this.Model.modelName} Found.`, 200, doc);
    });

  //   Create new Doc
  createOne = () =>
    catchAsync(async (req, res, next) => {
      /**
       * // NOTE
       * Each Model has some required fields, So I check the presentance of the these fields by customCreateValidation method
       *  */
      if (!this.customCreateValidation(req, next)) return;

      const doc = (await this.Model.create(req.body)).toObject();

      delete doc.password;
      delete doc.updatedAt;
      delete doc.createdAt;
      Response(res, `New ${this.Model.modelName} has been Created.`, 201, doc);
    });

  //   Update Doc
  updateOne = () =>
    catchAsync(async (req, res, next) => {
      /**
       * // NOTE
       * Each Model has constrians on some fields  , So I check the presentance of the these fields by customUpdateValidation method
       *  */
      if (!this.customUpdateValidation(req, next)) return;

      // Get User form db
      let doc = await this.Model.findById(req.params.id);

      if (!doc) return next(new AppError(`No ${this.Model.modelName} Found!`));

      doc = (
        await this.Model.findByIdAndUpdate(doc._id, req.body, {
          new: true,
        })
      ).toObject();

      delete doc.password;
      delete doc.updatedAt;
      delete doc.createdAt;

      Response(res, `${this.Model.modelName} has been Updated.`, 200, doc);
    });

  //   Delete Doc
  deleteOne = () =>
    catchAsync(async (req, res, next) => {
      await this.Model.findByIdAndDelete(req.params.id);

      Response(res, `${this.Model.modelName} has been Deleted.`, 204);
    });

  // SEC
  // Custom Validation
  customCreateValidation = (req, next) => {
    switch (this.Model.modelName) {
      case 'Cart':
        {
          const { belongTo } = req.body;
          if (!belongTo) {
            next(new AppError('Cart must have an owner!'));
            return false;
          }
          return true;
        }
        break;
    }
  };

  customUpdateValidation = (req, next) => {
    switch (this.Model.modelName) {
      case 'User':
        {
          if (req.body.password) {
            next(
              new AppError(
                `Can not change password with this endpoint! you can use this 'http://localhost:5000/api/v1/auth/resetpassowrd' `
              )
            );
            return false;
          }

          return true;
        }
        break;
    }
  };
}

export default Crud;

/**
 *
 *
 *  category (
 *  name
 *  id
 *  parent null
 *  child null
 *  slug
 *
 * american
 * grade
 *
 * education
 * sub[american, grade, math]
 *
 * )
 *
 *
 *
 * retureive teacher ==>
 * education => education.child => child
 */
