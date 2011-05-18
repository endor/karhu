require 'rubygems'
require 'sinatra'
require 'json'
require 'uri'

ROOT = File.dirname(__FILE__) + '/../..'
set :static, true
set :public, ROOT + '/public'
set :logging, false

get '/' do
  redirect "/index.html"
end

helpers do  
  def handle_put_delete_and_post(path, env, params, method)
    log_request(path, env, params, method)
    
    file = ROOT + '/features/support/api_failure'
    if(File.exists?(file))
      status 400
      File.read(file)
    else
      ''
    end
  end
  
  def log_request(path, env, params, method)
    file = ROOT + "/features/support/last_requests.log"
    requests = JSON.parse(File.read(file)) rescue []
    File.open(file, "w") do |f|
      f << (requests << request).to_json
    end
  end
end

get('/config.js') do
  File.read(ROOT + '/config/test.js')
end

post /\/(.+)/ do |path|
  params.delete('captures')
  file = ROOT + "/features/fixtures/#{URI.decode(path).gsub(' ', '_')}.json"

  objects = JSON.parse(File.read(file)) rescue []
  objects.push(params.merge({:id => (objects.length + 1)}))
  
  File.open(file, "w") do |f|
    f << objects.to_json
  end
  
  handle_put_delete_and_post(path, request.env, params, 'post')
end

put /\/(.+)/ do |path|
  params.delete('captures')
  handle_put_delete_and_post(path, request.env, params, 'put')
end

delete /\/(.+)/ do |path|
  params.delete('captures')
  _path = URI.decode(path).gsub(' ', '_').split('/')
  file = ROOT + "/features/fixtures/#{_path.first}.json"
  
  objects = JSON.parse(File.read(file)) rescue []
  objects.delete_if{|obj| obj['id'] == _path.last.to_i}
  
  File.open(file, "w") do |f|
    f << objects.to_json
  end
  
  handle_put_delete_and_post(path, request.env, params, 'delete')
end

get /\/(.+)/ do |path|
  log_request(path, env, params, 'get')
  
  content_type :json
  file = ROOT + "/features/fixtures/#{URI.decode(path).gsub(' ', '_')}.json"
  if(File.exists?(file))
    File.read(file)
  else
    '[]'
  end
end