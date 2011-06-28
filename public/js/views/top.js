karhu.TopView = Backbone.View.extend({
  el: $('#languages'),

  events: {
    "click .language": "switchLanguage",
    "click .logout": "logout"
  },
  
  initialize: function() {
    _.bindAll(this, 'switchLanguage');
  },
  
  switchLanguage: function(evt) {
    evt.preventDefault();
    
    var locale = $(evt.target).attr('data-language');
    karhu.i18n.setLocale(locale);
    karhu.views.main.render();
  },
  
  logout: function(evt) {
    evt.preventDefault();
    
    var session = new karhu.Session();
    session.destroy();
    window.location.href = '#/session/new';
  }
});