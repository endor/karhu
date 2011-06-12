(function() {

  function authenticate(xhr) {
    karhu.user = 'user';
    karhu.password = 'password';
    
    var token = '';
    if(karhu.token) {
      token = karhu.token;
    } else if(karhu.user && karhu.password) {
      token = SHA256(karhu.user + karhu.password);
    }
    karhu.token = token;
    xhr.setRequestHeader("X-Karhu-Authentication", 'user="' + karhu.user + '", token="' + karhu.token + '"');
  };

  function randomUrl(url, verb) {
    return url + (verb === 'get' ? '?random=' + (new Date()).getTime() : '');
  }
  
  var getUrl = function(object) {
    if (!(object && object.url)) throw new Error("A 'url' property or function must be specified");
    return _.isFunction(object.url) ? object.url() : object.url;
  };
  
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'delete': 'DELETE',
    'read'  : 'GET'
  };

  Backbone.sync = function(method, model, success, error) {
    var type = methodMap[method];
    var modelJSON = (method === 'create' || method === 'update') ?
                    JSON.stringify(model.toJSON()) : null;

    var params = {
      url:          randomUrl(getUrl(model), type),
      type:         type,
      contentType:  'application/json',
      data:         modelJSON,
      dataType:     'json',
      processData:  false,
      success:      success,
      error:        error,
      beforeSend:   function(xhr) { authenticate(xhr); }
    };

    $.ajax(params);
  };
  
})();