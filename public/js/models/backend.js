karhu.Backend = function(context) {

  this.get = function(url, data, success, error) {
    sendRequest('get', url, data, success, error);
  };
  
  this.post = function(url, data, success, error) {
    sendRequest('post', url, data, success, error);
  };
  
  this.del = function(url, data, success, error) {
    sendRequest('delete', url, data, success, error);    
  };
  
  this.put = function(url, data, success, error) {
    sendRequest('put', url, data, success, error);
  };
  
  this.authenticate = function(xhr) {
    var token = '';
    if(karhu.token) {
      token = karhu.token;
    } else if(karhu.user && karhu.password) {
      token = SHA256(karhu.user + karhu.password);
    }
    karhu.token = token;
    xhr.setRequestHeader("X-Karhu-Authentication", 'user="' + karhu.user + '", token="' + karhu.token + '"');
  };
  
  var authenticate = this.authenticate;
  
  function sendRequest(verb, url, data, success, error) {
    if(karhu.offline) {
      context.storeInOfflineQueue(verb, data, url, success);
      context.checkForOnlineStatus();
    } else {
      $.ajax({
        url: randomUrl(url, verb),
        data: data,
        type: verb,
        beforeSend: function(xhr) {
          authenticate(xhr);
        },
        success: function(result) {
          if(verb !== 'get') {
            context.storeInOnlineQueue(verb, result, url);              
          }            
          success(result);
        },
        error: function(xhr, errorMessage, tmp) {
          if(xhr.status === 0 && xhr.readyState === 0) {
            context.stateChangedToOffline();
            context.storeInOfflineQueue(verb, data, url, success);
          }
          if(error) { error.call(context); }
        }
      });
    }    
  }  
  
  function randomUrl(url, verb) {
    return url + (verb === 'get' ? '?random=' + (new Date()).getTime() : '');
  }
  
};