DateAndTimeView = function() {
  var view = {},
    day = new Date().getDate(),
    month = new Date().getMonth() + 1;
  
  view.dates = $.map([day + 1, day + 2, day + 3], function(current_day) {
    return {date: nullify_number(month) + '/' + nullify_number(current_day)};
  });
  view.dates.unshift({date: 'Today (' + nullify_number(month) + '/' + nullify_number(day) + ')'});
  
  function nullify_number(number) {
    return (number < 10 ? '0' + number : number);
  };
  
  view.times = [];
  for(var i = 1; i <= 12; i++) {
    view.times.push({time: nullify_number(i) + ':00'});
    view.times.push({time: nullify_number(i) + ':30'});
  };
  
  return view;
};