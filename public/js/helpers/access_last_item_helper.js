karhu.AccessLastItemHelper = {
  prepareInputFields: function() {
    var context = this;

    $('.store_change').live('change', function() {
      var $this = $(this),
        type = $this.attr('id').split('_')[0],
        item = context.app.last_location[1].match(/edit/) ?
                    'last_edited_' + type : 'last_added_' + type;

      var object = context.store.get(item);
      object.data[$this.attr('name').match(/\[([^\]]+)\]/)[1]] = $this.val();
      context.store.set(item, object);
    });
  },

  handleLastAccess: function(params, item, callback) {
    var lastAccessedItem = this.store.get(item),
      toStore;

    if(!lastAccessedItem) {
      if(params) {
        toStore = {id: params.id, data: {}};
      } else {
        toStore = {data: {}};
      }
      this.store.set(item, toStore);
    }
    
    callback(lastAccessedItem);
  },
  
  accessLastItem: function(key, callback) {      
    var split_key = key.split('_');
    var action = split_key[1] === 'edited' ? 'edit' : 'new';
    var path = split_key[2] === 'product' ? '#/products' : '#/categories';
    var object = this.store.get(key);
          
    if(action === 'edit' &&
      ((this.verb === 'put' && this.path.match(new RegExp(path + '\\/' + object.id))) ||
      (this.verb === 'get' && this.path.match(new RegExp(path + '\\/' + object.id + '\\/edit'))))) {
      callback();
      return;
    }
    if(action === 'new' &&
      ((this.verb === 'post' && this.path.match(new RegExp(path))) ||
      (this.verb === 'get' && this.path.match(new RegExp(path + '\\/new'))))) {
      callback();
      return;
    }

    if(action === 'edit') {
      this.flash('Please finnish editing your ' + split_key[2] + '.');
      this.redirect(path + '/' + object.id + '/edit');        
    } else {
      this.flash('Please finnish adding your ' + split_key[2] + '.');
      this.redirect(path + '/new');        
    }
  }
};