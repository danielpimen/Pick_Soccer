const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validatePostInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, {min: 5, max: 400})) {
    errors.text = 'Post must be between 5 and 400 characters';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is needed';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
