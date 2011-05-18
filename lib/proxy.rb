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
  file = ROOT + "/features/fixtures/#{URI.decode(path).gsub(' ', '_')}.json"

  objects = JSON.parse(File.read(file)) rescue []
  objects.push(params)
  
  File.open(file, "w") do |f|
    f << objects.to_json
  end
end

put /\/(.+)/ do |path|
end

delete /\/(.+)/ do |path|
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