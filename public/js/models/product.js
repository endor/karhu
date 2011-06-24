karhu.Product = Backbone.Model.extend({
  toJSON: function() {
    return _.extend(_.clone(this.attributes), {
      unit_price: this.parsedUnitPrice(),
      valid_to: this._englishValidTo()
    });
  },

  toTemplate: function() {
    var category = this.category() || {toJSON: function() {}};

    return _.extend(this.toJSON(), {
      unit_price: this.formattedUnitPrice(),
      valid_to: this.formattedValidTo(),
      category: category.toJSON()
    });
  },
  
  category: function() {
    return karhu.Categories.get(this.get('category_id'));
  },
  
  parsedUnitPrice: function() {
    var unit_price = this.get('unit_price');
    if(unit_price && _.isString(unit_price)) {
      return $.global.parseFloat(unit_price.match(/[\d\.\,]+/)[0]);
    } else {
      return unit_price;
    }
  },
  
  parsedValidTo: function() {
    var valid_to = this.get('valid_to');
    if(valid_to) {
      return $.global.parseDate(valid_to) || Date.parse(valid_to);
    } else {
      return null;
    }
  },
  
  formattedUnitPrice: function() {
    return $.global.format(this.parsedUnitPrice(), 'n') + '€';
  },
  
  formattedValidTo: function() {
    return $.global.format(this.parsedValidTo(), 'd');
  },
  
  validate: function(attrs) {
    var errors = {};

    ['name', 'description', 'unit_price', 'valid_to'].forEach(function(attr) {
      if(!attrs[attr] || attrs[attr].length === 0) {
        errors[attr] = karhu.i18n.translate('cannot_be_empty');
      }
    });
    if(attrs['name'] && attrs.name.length > 100) {
      errors['name'] = karhu.i18n.translate('cannot_be_longer_than_100_characters');
    }
    if(attrs['unit_price'] && !attrs.unit_price.match(this._regularExpression('unit_price'))) {
      errors['unit_price'] = karhu.i18n.translate('wrong_format_price');
    }
    if(attrs['valid_to'] && !attrs.valid_to.match(this._regularExpression('valid_to'))) {
      errors['valid_to'] = karhu.i18n.translate('wrong_format_date');
    }
    if(attrs.valid_to && !(Date.today().clearTime().compareTo(Date.parse(attrs.valid_to)) < 0)) {
      errors['valid_to'] = karhu.i18n.translate('today_or_after');
    }
    
    if(!_.isEmpty(errors)) { return errors; }
  },
  
  _regularExpression: function(field) {
    return {
      en: {
        unit_price: /^(\d{1,3}([,]\d{3})*|(\d+))([.]\d{2})?( )?€?$/,
        valid_to: /\d{1,2}\/\d{1,2}\/\d{4}/
      },
      de: {
        unit_price: /^(\d{1,3}([.]\d{3})*|(\d+))([,]\d{2})?( )?€?$/,
        valid_to: /\d{1,2}\.\d{1,2}\.\d{4}/
      }
    }[karhu.locale][field];
  },
  
  _englishValidTo: function() {
    var valid_to = this.parsedValidTo();
    return valid_to ? valid_to.toString('MM/dd/yyyy') : null;
  }
});