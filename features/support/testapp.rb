require 'rubygems'
require 'sinatra'
require 'json'
require 'uri'
require 'digest/sha2'
require File.dirname(__FILE__) + '/authentication'

ROOT = File.dirname(__FILE__) + '/../..'
set :static, true
set :public, ROOT + '/public'
set :logging, false

get '/' do
  redirect "/index.html"
end

helpers do
  include Authentication
  
  def protected!(path)
    unless authorized?(path)
      throw(:halt, [403, "Not authorized\n"])
    end
  end

  def authorized?(path)
    received_credentials = request.env['HTTP_X_NAAMA_AUTHENTICATION']
    email, password = File.read(ROOT + '/features/support/credentials').split(':')
    
    authentication_header(email, password, path) == received_credentials
  end
  
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
  
  def authenticate(request, env)
    auth_header = 'HTTP_X_NAAMA_AUTHENTICATION'
    if env[auth_header]
      request.merge({'headers' => {auth_header => env[auth_header]}})
    else
      request
    end
  end
  
  def log_request(path, env, params, method)
    params.delete('captures')
    request = authenticate({'params' => params, 'path' => path, 'method' => method}, env)
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
  handle_put_delete_and_post(path, request.env, params, 'post')
end

put /\/(.+)/ do |path|
  handle_put_delete_and_post(path, request.env, params, 'put')
end

delete /\/(.+)/ do |path|
  handle_put_delete_and_post(path, request.env, params, 'delete')
end

get /\/(.+)/ do |path|
  if(path.match(/^u\/([^\/]+)$/))
    protected!("/#{path}")
  end
  
  log_request(path, env, params, 'get')
  
  content_type :json
  file = ROOT + "/features/fixtures/#{URI.decode(path).gsub(' ', '_')}.json"
  if(File.exists?(file))
    File.read(file)
  else
    throw(:halt, [404, "Not found\n"])
  end
end