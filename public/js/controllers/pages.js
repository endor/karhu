karhu.Pages = function(app) {
  app.get('#/pages/:name', function(context) {
    context.render('templates/pages/' + context.params.name + '.mustache', {}, function(rendered_view) {
      $(document).one('close.facebox', function() {
        context.redirect(karhu.lastLocation);
      });
      
      $.facebox(rendered_view);
    });
  });
}