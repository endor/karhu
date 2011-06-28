(function() {
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];
    
    var params = {
      beforeSend:   function(xhr) { authenticate(xhr); },
      url:          getUrl(model),
      type:         type,
      data:         data(method, model),
      dataType:     'json',
      processData:  true,
      success:      options.success,
      error:        options.error || function() {}
    };

    $.ajax(params);
  };

  function data(method, model) {
    if(method === 'create' || method === 'update') {
      return model.toJSON();
    } else {
      return null;
    }
  }
  
  function getUrl(object) {
    if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
    return _.isFunction(object.url) ? object.url() : object.url;
  }
  
  function authenticate(xhr) {
    if(Backbone.sync.password) {
      Backbone.sync.token = SHA256(Backbone.sync.user + Backbone.sync.password);
      store.set('token', Backbone.sync.token);
      store.set('user', Backbone.sync.user);
      delete Backbone.sync.password;
    }
    
    xhr.setRequestHeader("X-Karhu-Authentication", 'user="' + Backbone.sync.user + '", token="' + Backbone.sync.token + '"');
  }
})();