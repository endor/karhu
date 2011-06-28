karhu.i18n = new karhu.I18n(store);

if(store.get('token')) {
  Backbone.sync.token = store.get('token');
  Backbone.sync.user = store.get('user');
}