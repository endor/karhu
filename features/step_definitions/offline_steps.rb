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
  assert_request_exists(type) do |requests, path|
    requests.select do |r|
      r['path'] == path && r['method'] == 'post' && r['params']['name'] == name
    end
  end
end

Then /the api should have received a call to update a (\w+) with the name "([^\"]+)" and the new description "([^\"]+)"/ do |type, name, description|
  assert_request_exists(type) do |requests, path|
    requests.select do |r|
      r['path'].match(/#{path}\/\d+/) && r['method'] == 'put' && r['params']['name'] == name && r['params']['description'] == description
    end
  end
end

def assert_request_exists(type)
  path = type == 'product' ? 'products' : 'categories'
  patiently do
    requests = JSON.parse(File.read(File.dirname(__FILE__) + '/../support/last_requests.log'))
    correct_requests = yield(requests, path)
    assert_equal correct_requests.size, 1
  end
end