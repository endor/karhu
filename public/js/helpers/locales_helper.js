karhu.LocalesHelper = {
  setLocale: function(locale) {
    karhu.locale = locale;
    this.store.set('locale', locale);
    $.global.preferCulture(locale);
    this.translateStaticElements();    
  },
  
  initializeLocales: function() {
    ['en', 'de'].forEach(function(locale) {
      $.global.localize("karhu", locale, karhu.locales[locale] || {});
    });
    var locale = this.store.get('locale') || 'en';
    this.setLocale(locale);
  },
  
  translateStaticElements: function() {
    $('.translate').each(function(idx, element) {
      var $element = $(element);
      $element.text($.global.localize("karhu")[$element.attr('data-translate-key')]);
    });    
  }
};