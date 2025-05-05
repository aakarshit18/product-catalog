const { body, validationResult } = require('express-validator');

// Validators
const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),

  body('password')
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .withMessage(
      'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.'
    ),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  registerValidator,
  validate,
};
