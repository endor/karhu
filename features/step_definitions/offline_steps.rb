Before do
  file = File.dirname(__FILE__) + "/../support/last_requests.log"
  File.unlink(file) if File.exists?(file)
end

When /I get disconnected from the internet/ do
  page.execute_script('window.origAjax = $.ajax; $.ajax = function(options) { if(options.error) { options.error({status: 0, readyState: 0}, "error", ""); } }');
end

When /I get connected to the internet/ do
  page.execute_script('$.ajax = window.origAjax;')
  visit('#/products')
end

Then /the api should have received a call to create a (\w+) with the name "([^\"]+)"/ do |type, name|
  path = type == 'product' ? 'products' : 'categories'
  patiently do
    requests = JSON.parse(File.read(File.dirname(__FILE__) + '/../support/last_requests.log'))
    correct_requests = requests.select do |r|
      r && r['path'] == path && r['method'] == 'post' && r['params']['name'] == name
    end
    assert_equal correct_requests.size, 1
  end
end