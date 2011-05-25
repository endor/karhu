karhu.Queue = function(queue, categories) {
  queue = queue || [];
  
  var makeReadable = function(attr) {
    if(attr === "category_id") { attr = "category"; }
    if(attr === "unit_price") { attr = "price"; }
    return $.global.localize("karhu")[attr];
  }
  
  queue.forEach(function(action) {    
    var verb = action.verb === 'post' ? 'Created' : 'Updated';
    var type = action.url.match(/products/) ? 'Product' : 'Category';
    
    action.humanReadableSummary = verb + ' ' + type + ' ' + action.data.name;
    
    var attributes = [];
    ['name', 'description', 'unit_price', 'valid_to'].forEach(function(attr) {
      if(action.data[attr]) {
        attributes.push(makeReadable(attr) + ': ' + action.data[attr]);
      }
    });
    if(action.data.category_id && categories) {
      var name = _.find(categories, function(category) {
        return parseInt(category.id, 10) === parseInt(action.data.category_id, 10);
      }).name;
      attributes.push(makeReadable('category_id') + ': ' + name);
    }
    
    action.humanReadableAttributes = attributes.join(', ');
  });
  
  return {cached_actions: queue};
}