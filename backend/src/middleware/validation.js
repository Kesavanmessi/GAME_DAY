const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    throw new ApiError(400, 'Validation failed', true, { errors: errorMessages });
  };
};

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(detail => ({
        field: detail.context.key,
        message: detail.message.replace(/\"/g, ""),
        type: detail.type
      }));
      throw new ApiError(400, 'Validation failed', true, { errors: errorMessages });
    }
    next();
  };
};

module.exports = {
  validate,
  validateRequest
};
