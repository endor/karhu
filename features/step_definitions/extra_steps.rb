Then /I should see a button "([^\"]*)"/ do |text|
  xpath = "//button[contains(., '#{text}')] | //input[@value='#{text}']"
  assert page.has_xpath?(xpath) && locate(xpath).visible?
end

Then /I should not see a button "([^\"]*)"/ do |text|
  xpath = "//button[contains(., '#{text}')] | //input[@value='#{text}']"
  assert (page.has_no_xpath?(xpath) || !locate(xpath).visible?)
end

Then /I should not see a link "([^\"]*)"/ do |text|
  assert page.has_no_xpath?("//a[contains(., '#{text}')]")
end

Then /I should see a link "([^\"]*)"/ do |text|
  assert page.has_xpath?("//a[contains(., '#{text}')]")
end

Then /I should see a password field "(\w+)"/ do |id|
  assert page.has_xpath?("//input[@id='#{id}'][@type='password']")
end

Then /^the button "([^\"]*)" should be disabled$/ do |value|
  assert page.has_xpath?("//input[@type='submit'][@value='#{value}'][@disabled]")
end

Then /I should be on the (.+)/ do |path|
  assert page.current_url.match(/#{Regexp.escape path_to(path)}/)
end

Then /I should not be on the (.+)/ do |path|
  assert !page.current_url.match(/#{Regexp.escape path_to(path)}/)
end

Then /^"([^\"]*)" should be the selected "([^\"]*)"$/ do |selection, name_of_select|
  assert page.has_select?(name_of_select, :selected => selection)
end

When /I wait for (\d)s/ do |seconds|
  sleep seconds.to_i
end

Then /the "([^\"]+)" link should be hidden/ do |text|
  assert !page.find(:xpath, "//a[contains(., '#{text}')]").visible?
end
