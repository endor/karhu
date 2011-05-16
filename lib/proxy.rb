require 'rubygems'
require 'sinatra'
require 'httparty'
require 'json'
require 'uri'

set :static, true
set :public, File.dirname(__FILE__) + '/../public'
set :logging, true

helpers do
  def write(method, path)
    params.delete('captures')
    response = HTTParty.send(method, @@url + URI.encode(path), {:query => params})

    status response.code
    response.body
  end
end

get '/' do
  redirect "/index.html"
end

get('/config.js') do
  File.read(ROOT + '/config/default.js')
end

get /(\/.+)/ do |path|
  content_type :json

  response = HTTParty.get(@@url + URI.encode(path))
  
  status response.code
  response.body
end

post /(\/.+)/ do |path|
  write(:post, path)
end

put /(\/.+)/ do |path|
  write(:put, path)
end

delete /(\/.+)/ do |path|
  write(:delete, path)
end

public

def remote_api_base_url=(url)
  @@url = url
end