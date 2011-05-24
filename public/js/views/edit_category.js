karhu.EditCategory = function(category, last_edited_category) {
  if(last_edited_category) {
    var data = {};
    
    _.each(last_edited_category.data, function(val, key) {
      if(val !== "") { data[key] = val; }
    });
    
    _.extend(category, data);
  }

  return category;
}