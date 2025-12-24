const { body } = require('express-validator');
const User = require('../models/User');

const userValidationRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail()
      .custom(async (email) => {
        const user = await User.findOne({ email });
        if (user) {
          throw new Error('Email already in use');
        }
        return true;
      }),
    body('username')
      .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3-30 characters')
      .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores')
      .custom(async (username) => {
        const user = await User.findOne({ username });
        if (user) {
          throw new Error('Username already taken');
        }
        return true;
      }),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
    body('phone')
      .optional()
      .isMobilePhone().withMessage('Please provide a valid phone number')
  ];
};

const loginValidationRules = () => {
  return [
    body('email')
      .isEmail().withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required')
  ];
};

const updateProfileValidationRules = () => {
  return [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
    body('phone')
      .optional()
      .isMobilePhone().withMessage('Please provide a valid phone number'),
    body('bio')
      .optional()
      .trim()
      .isLength({ max: 500 }).withMessage('Bio cannot be longer than 500 characters')
  ];
};

const changePasswordValidationRules = () => {
  return [
    body('currentPassword')
      .notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
      .matches(/[0-9]/).withMessage('New password must contain at least one number')
      .matches(/[a-z]/).withMessage('New password must contain at least one lowercase letter')
      .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
  ];
};

module.exports = {
  userValidationRules,
  loginValidationRules,
  updateProfileValidationRules,
  changePasswordValidationRules
};
