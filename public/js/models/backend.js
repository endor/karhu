(function() {
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  Backbone.sync = function(method, model, success, error) {
    var type = methodMap[method];
    var modelJSON = (method === 'create' || method === 'update') ?
                    model.toJSON() : null;

    var params = {
      url:          getUrl(model),
      type:         type,
      data:         modelJSON,
      dataType:     'json',
      processData:  true,
      success:      success,
      error:        error
    };

    $.ajax(params);
  };

  var getUrl = function(object) {
    if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
    return _.isFunction(object.url) ? object.url() : object.url;
  };
})();