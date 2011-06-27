karhu.Category = Backbone.Model.extend({
  toTemplate: function() {
    return this.toJSON();
  },
  
  validate: function(attrs) {
    var errors = {};
    if(attrs.name.length === 0) {
      errors['name'] = karhu.i18n.translate('cannot_be_empty');
    } 
    if(attrs.description.length === 0) {
      errors['description'] = karhu.i18n.translate('cannot_be_empty');
    }
    if(attrs.name.length > 100) {
      errors['name'] = karhu.i18n.translate('cannot_be_longer_than_100_characters');
    }
    if(!_.isEmpty(errors)) { return errors; }
  },
  
  url: function() {
    var id = this.get('id');
    
    if(id) {
      return '/categories/' + id;
    } else {
      return '/categories';
    }
  }
});