Given /^a category "([^\"]+)" with the description "([^\"]+)"$/ do |name, description|
  FileUtils.mkdir_p("#{fixtures_path}/categories")
  
  @categories ||= []
  category = {:name => name, :description => description, :id => @categories.length + 1}
  @categories.push(category)
  
  File.open("#{fixtures_path}/categories.json", 'w') do |f|
    f << @categories.to_json
  end  
  
  File.open("#{fixtures_path}/categories/#{@categories.length}.json", 'w') do |f|
    f << category.to_json
  end
end