karhu.OfflineHelper = {

  stateChangedToOffline: function() {
    if(!karhu.offline) {
      karhu.offline = true;
      this.flash("you_are_currently_offline");
      $('.cached-actions').show();
      $('.delete_form').hide();
    }
  },
  
  stateChangedToOnline: function() {
    if(karhu.offline) {
      karhu.offline = false;
      this.flash("you_are_currently_online");
      $('.cached-actions').hide();
      $('.delete_form').show();
      this.runOfflineQueue();

      var last_location = this.app.last_location;
      if(last_location[0] === 'get') {
        this.app.runRoute('get', last_location[1].match(/(\#.+)$/)[1], {});
      } else {
        this.app.runRoute('get', '#/products', {});
      }
    }
  },
      
  notifyOfOnlineOfflineStatus: function() {
    var context = this;
    $(window).bind("online offline", function() {
      if(navigator.onLine) {
        context.stateChangedToOnline();
      } else {
        context.stateChangedToOffline();
      }
    });
  },
  
  adjustElementsToOnlineStatus: function() {
    if(karhu.offline) {
      $('.delete_form').hide();
      $('.cached-actions').show();
    } else {
      $('.delete_form').show();
      $('.cached-actions').hide();      
    }
  },
  
  checkForOnlineStatus: function() {
    var context = this;
    $.ajax({
      url: '/test',
      beforeSend: function(xhr) { context.authenticate(xhr); },
      success: function() { context.stateChangedToOnline(); },
      error: function() {}
    });
  }  
  
};