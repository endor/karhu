karhu.Queue = function(queue_name, store) {
  this.cached_actions = store.get(queue_name + 'Queue') || [];

  this.render = function(categories) {
    this.cached_actions.forEach(function(action) {      
      addHumanReadableSummary(action);
      addHumanReadableAttributes(action, categories);
    });

    return {cached_actions: this.cached_actions};
  };  
  
  
  function makeReadable(attr) {
    if(attr === "category_id") { attr = "category"; }
    if(attr === "unit_price") { attr = "price"; }
    return $.global.localize("karhu")[attr];
  }
  
  function addHumanReadableSummary(action) {
    var verb = action.verb === 'post' ? 'Created' : 'Updated',
      type = action.url.match(/products/) ? 'Product' : 'Category';

    action.humanReadableSummary = verb + ' ' + type + ' ' + action.data.name;
  }
  
  function addHumanReadableAttributes(action, categories) {
    var attributes = [];

    ['name', 'description', 'unit_price', 'valid_to'].forEach(function(attr) {
      if(action.data[attr]) {
        attributes.push(makeReadable(attr) + ': ' + action.data[attr]);
      }
    });

    if(action.data.category_id && categories) {
      attributes.push(makeReadable('category_id') + ': ' + categoryNameFromId(action.data.category_id, categories));
    }

    action.humanReadableAttributes = attributes.join(', ');
  }
  
  function categoryNameFromId(category_id, categories) {
    return _.find(categories, function(category) {
      return parseInt(category.id, 10) === parseInt(category_id, 10);
    }).name;    
  }
  
};