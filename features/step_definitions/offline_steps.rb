When /I get disconnected from the internet/ do
  page.execute_script('window.origAjax = $.ajax; $.ajax = function(options) { if(options.error) { options.error({status: 0, readyState: 0}, "error", ""); } }');
end

When /I get connected to the internet/ do
  page.execute_script('$.ajax = window.origAjax;')
  visit('#/products')
end

Then /the api should have received a call to create a product with the name "([^\"]+)"/ do |name|
  patiently do
    requests = JSON.parse(File.read(File.dirname(__FILE__) + '/../support/last_requests.log'))
    request = requests.find{|r| r && r['path'] == 'products' && r['method'] == 'post'}
    assert_equal request['params']['name'], name
  end
end

Then /the api should have received a call "([^\"]+)" with the (\w+) "([^\"]+)"/ do |type, attribute, value|
end