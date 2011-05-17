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

helpers do  
  def handle_put_delete_and_post(path, env, params, method)
    file = ROOT + '/features/support/api_failure'
    if(File.exists?(file))
      status 400
      File.read(file)
    else
      ''
    end
  end  
end

get('/config.js') do
  File.read(ROOT + '/config/default.js')
end

post /\/(.+)/ do |path|
  handle_put_delete_and_post(path, request.env, params, 'post')
end

put /\/(.+)/ do |path|
  handle_put_delete_and_post(path, request.env, params, 'put')
end

delete /\/(.+)/ do |path|
  handle_put_delete_and_post(path, request.env, params, 'delete')
end

get /\/(.+)/ do |path|
  content_type :json
  file = ROOT + "/features/fixtures/#{URI.decode(path).gsub(' ', '_')}.json"
  if(File.exists?(file))
    File.read(file)
  else
    throw(:halt, [404, "Not found\n"])
  end
end