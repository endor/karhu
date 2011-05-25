karhu.Category = function() {
  var category = {};
  
  category.validations = function() {
    return {
      rules: {
        'category[name]': {
          required: true,
          maxlength: 100
        },
        'category[description]': {required: true}
      },
      messages: {
        'category[name]': {
          required: 'cannot be empty',
          maxlength: 'cannot be longer than 100 characters'
        },
        'category[description]': 'cannot be empty'
      }
    };
  };
  
  return category;
};