require 'rubygems'
require 'sinatra'
require 'json'
require 'uri'

ROOT = File.dirname(__FILE__) + '/..'
set :static, true
set :public, ROOT + '/public'
set :logging, false

get '/' do
  redirect "/index.html"
end

get('/config.js') do
  File.read(ROOT + '/config/default.js')
end

post /\/(.+)/ do |path|
  params.delete('captures')
  file = ROOT + "/features/fixtures/#{URI.decode(path).gsub(' ', '_')}.json"
  
  objects = JSON.parse(File.read(file)) rescue []
  objects.push(params.merge({:id => (objects.length + 1)}))
  
  File.open(file, "w") do |f|
    f << objects.to_json
  end
  ''
end

put /\/(.+)/ do |path|
end

delete /\/(.+)/ do |path|
  params.delete('captures')
  path = URI.decode(path).gsub(' ', '_').split('/')
  file = ROOT + "/features/fixtures/#{path.first}.json"
  
  objects = JSON.parse(File.read(file)) rescue []
  objects.delete_if{|obj| obj['id'] == path.last.to_i}
  
  File.open(file, "w") do |f|
    f << objects.to_json
  end
  ''  
end

get /\/(.+)/ do |path|
  content_type :json
  file = ROOT + "/features/fixtures/#{URI.decode(path).gsub(' ', '_')}.json"
  if(File.exists?(file))
    File.read(file)
  else
    '[]'
  end
end