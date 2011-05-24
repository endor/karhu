When /the browser is closed and reopened with the start page/ do
  When 'I go to the start page'
end

When /I trigger a "([^\"]+)" event on the "([^\"]+)"/ do |event, id|
  page.execute_script("$('##{id}').trigger('#{event}');")
end
