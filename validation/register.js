const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};
  if (!Validator.isLength(data.name, {min: 4, max: 30})) {
    errors.name = 'Name Must Be Between 4 and 30 Characters';
  }
  return {
    errors,
    isValid: isEmpty(errors),
  };
};
