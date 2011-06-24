karhu.I18n = function(store) {
  this.translate = function(str) {
    return $.global.localize("karhu")[str] || str;
  };
  
  var translate = this.translate;
  
  this.currentLocale = function() {
    return this.locale;
  };

  this.setLocale = function(locale) {
    this.locale = locale;
    store.set('locale', this.locale);
    $.global.preferCulture(this.locale);
    translateStaticElements();
    $.datepicker.setDefaults($.datepicker.regional[this.locale]);
  };
  
  this.translateValidationMessages = function(validations) {
    validations.messages = _.inject(validations.messages, function(result, messages, key) {
      result[key] = _.inject(messages, function(result, message, key) {
        result[key] = translate(message);
        return result;
      }, {});
      
      return result;
    }, {});
    
    return validations;
  };
  
  ['en', 'de'].forEach(function(locale) {
    $.global.localize("karhu", locale, karhu.locales[locale] || {});
  });
  var locale = store.get('locale') || 'en';
  this.setLocale(locale);
  
  function translateStaticElements() {
    $('.translate').each(function(idx, element) {
      var $element = $(element);
      $element.text(translate($element.attr('data-translate-key')));
    });
  }
};