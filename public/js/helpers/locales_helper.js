//
// TODO
// maybe introduce an i18n "class"
//
karhu.LocalesHelper = {
  setLocale: function(locale) {
    karhu.locale = locale;
    this.store.set('locale', locale);
    $.global.preferCulture(locale);
    this.translateStaticElements();
    $.datepicker.setDefaults($.datepicker.regional[karhu.locale]);
  },
  
  translateStaticElements: function() {
    $('.translate').each(function(idx, element) {
      var $element = $(element);
      $element.text($.global.localize("karhu")[$element.attr('data-translate-key')]);
    });    
  },
  
  translateValidationMessages: function(validations) {
    validations.messages = _.inject(validations.messages, function(result, messages, key) {
      result[key] = _.inject(messages, function(result, message, key) {
        result[key] = $.global.localize("karhu")[message] || message;
        return result;
      }, {});
      
      return result;      
    }, {});
    
    return validations;
  }
};