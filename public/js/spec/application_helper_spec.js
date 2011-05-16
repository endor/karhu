describe 'ApplicationHelper'
  before_each
    application_helper = ApplicationHelper
    application_helper._cache = {}
  end
  
  describe 'authenticate'
    it 'should set the authentication header on the xhr'
      // sha256(password_sha + email + uri)
      xhr = {headers: [], setRequestHeader: function(key, value) {
          var pair = {};
          pair[key] = value;
          this.headers.push(pair);
        }
      }
      application_helper.authenticate(xhr, '/u/joe@doe.com', 'joe@doe.com', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08')
      xhr.headers[0]['X-Naama-Authentication'].should.equal('username="joe@doe.com", response="fd77dcf20b28cb9e6c90279ae6e44329fa035f75fc51e6effe25ec13e50b5a95", version="1"')
    end
  end
  
  describe 'current_address'
    it 'should return the first address if non is selected'
      var addresses = [{nick: 'work'}, {nick: 'home'}]
      application_helper.store = {get: function() {}}
      application_helper.current_address(addresses).should.eql({nick: 'work'})
    end
    
    it 'should return the selected address'
      var addresses = [{nick: 'home'}, {nick: 'work'}]
      application_helper.store = {get: function() { return 'work'; }}
      application_helper.current_address(addresses).should.eql({nick: 'work'})
    end
  end
  
  describe 'addresses'
    it 'should return the default address if non provided'
      application_helper.store = {get: function() {return null}}
      application_helper.addresses().should.eql([{addr: '5 5th Avenue', city: 'New York', state: 'NY', zip: '10021'}])
    end
    
    it 'should return the address from the store if not logged in'
      application_helper.store = {get: function(key) {
        if(key == 'email') { return null; }
        if(key == 'address') { return {addr: '744 Delivery Rd'}; }
      }}
      application_helper.addresses().should.eql([{addr: '744 Delivery Rd'}])
    end
    
    it 'should return the user\'s addresses if logged in'
      var options = null;
      application_helper.store = {get: function(key) { return 'joe@doe.com'; }}
      application_helper.addresses_url = function() { return '/u/joe@doe.com/addrs'; }
      $.ajax = function(_options) {
        options = _options;
        return {responseText: JSON.stringify([{addr: '744 Delivery Rd'}])};
      }
      application_helper.addresses().should.eql([{addr: '744 Delivery Rd'}])
      options.should.eql({async: false, url: '/u/joe@doe.com/addrs', type: 'get'})
    end
  end
end