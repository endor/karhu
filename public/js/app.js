var karhu = $.sammy(function() { with(this) {
  use(Sammy.Mustache);
  use(Sammy.NestedParams);
  use(Sammy.JSON);
  
  element_selector = 'body';
  cache_partials = false;
  
  helpers(ApplicationHelper);
  helpers({ store: config.store });
  
  Restaurants(this);
  Items(this);
  TrayController(this);
  Checkout(this);
  Session(this);
  Tip(this);
  CreditCards(this);
  Account(this);
  Address(this);
  Addresses(this);
  PreviousOrders(this);
  Users(this);
  
  get('#/', function(context) {
    context.redirect('#/restaurants');
  });
  
  bind('init', function() { with(this) {
    this.configure_facebox();
  }});
  
  before(function(context) {
    if(!context.store.get('address') && !context.store.get('email') && !context.path.match(/\#\/session/)) {
      $.get('templates/shared/states.mustache', function(states) {
        context.partial('templates/session/new.mustache', {states: states}, function(html) {
          $.facebox(html);
          $('#facebox form').validate({rules: {
            email: {required: {depends: "#addr:blank"}},
            password: {required: {depends: "#email:filled"}},
            addr: {required: {depends: "#email:blank"}},
            city: {required: {depends: "#addr:filled"}},
            state: {required: {depends: "#addr:filled"}},
            zip: {
              required: {depends: "#addr:filled"},
              digits: {depends: "#addr:filled"}
            }
          }});
        });        
      });
    }
  });
  
  before(function(context) {
    if(context.verb == 'get') {
      context.render_tray();
    }
  });
  
  before(function(context) {
    $('.nav').empty();
  });
  
  before(function(context) {
    if(context.store.get('address') || context.store.get('email')) {
      $('.logout').show();
    } else {
      $('.logout').hide();
    }
  });
  
  before(function(context) {
    var email = context.store.get('email');
    if(email) {
      var username = email.split('@')[0];
      $('#greeting').text('Welcome ' + username);
    } else {
      $('#greeting').text('Welcome');
    };
  });
  
  before((function() {
    var history = '';
    return function(context) {
      if(context.verb == 'get') {
        history = context.path;
      };
      context.history = history;
    };
  })());
  
  before(function(context) {
    if($('div.addresses').html() == '') {
      var addresses = context.addresses(),
        view = {
          addresses: addresses,
          has_addresses: addresses.length > 1,
          current_address: [context.current_address(addresses)],
          logged_in: context.store.get('email')
        },
        selected_nickname = view.current_address[0] ? view.current_address[0].nick : '';
    
      context.partial('templates/addresses/index.mustache', view, function(html) {
        $('div.addresses').html(html);
        $('div.addresses select#nickname').val(selected_nickname);
        $('div.addresses select#nickname').live('change', function() {
          $(this).parents('form:first').submit();
        });
      });
    }
  });
  
  before(function(context) {
    context.partial('templates/shared/date_and_time.mustache', DateAndTimeView(), function(html) {
      $('div.date_and_time').html(html);
      var date = new Date(),
        minutes = date.getMinutes() < 30 ? '00' : '30';
        
      $('.date_and_time select.time').val(date.toString('hh:') + minutes);
      $('.date_and_time select.ampm').val(date.toString('tt').toLowerCase());
    });
  });
  
  before(function(context) {
    var email = context.store.get('email');
    if(email) {
      var url = context.recent_orders_url(email, 5);
      $.ajax({
        url: url,
        type: 'get',
        beforeSend: function(xhr) {
          context.authenticate(xhr, url);
        },
        success: function(orders) {
          context.partial('templates/previous_orders/recent.mustache', PreviousOrdersView(orders), function(html) {
            $('.recent_orders').html(html);
          })
        }
      });
    };
  });
}});
 
$(function() {
  $('a.dialog').live('click', function(e) {
    karhu.runRoute('get', $(this).attr('href'), {});
    e.stopPropagation();
    e.preventDefault();
  });
  
  $('a.input_control').live('click', function(e) {
    e.preventDefault();
    var input = $(this).parent().siblings('input.controlled:first'),
      that = this;
    input.val(function(i, val) {
      var result = parseInt(val, 10) + parseInt($(that).attr('data-increment'), 10)
      return result < 0 ? 0 : result;
    });
  });
  
  $.validator.addMethod("matchesSHA", function(value, element) {
    return this.settings.rules[$(element).attr('name')].matchesSHA == SHA256(value);
  });
  
  karhu.run('#/');
  karhu.trigger('init');
});