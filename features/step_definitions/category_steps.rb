Given /^a category "([^\"]+)" with the description "([^\"]+)"$/ do |name, description|
  FileUtils.mkdir_p("#{fixtures_path}/categories")
  
  @categories ||= []
  @categories.push({:name => name, :description => description, :id => @categories.length + 1})
  
  File.open("#{fixtures_path}/categories.json", 'w') do |f|
    f << @categories.to_json
  end  
end