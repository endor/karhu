ROOT = File.join(File.dirname(__FILE__), '..')

require 'rubygems'
require 'sinatra'
require 'json'
require 'uri'
require 'will_paginate'
require ROOT + "/lib/authentication"
require ROOT + "/lib/helpers"

set :static, true
set :public, File.join(ROOT, 'public')
set :logging, true

get '/' do
  redirect "/index.html"
end

get '/test' do
  'test'
end

get('/config.js') do
  File.read(ROOT + '/config/test.js')
end

helpers do
  include Authentication
  include Helpers

  def credentials
    File.read(ROOT + '/features/support/credentials').split(':')
  end
  
  def protected!
    throw(:halt, [403, "Not authorized\n"]) unless authorized?
  end

  def handle_put_delete_and_post(path, env, params, method)
    protected!
    params.delete('captures')
    params = cast_values_to_correct_types(params)
    path = URI.decode(path).gsub(' ', '_')
    yield(params, path)
  end  
end

post /\/(.+)/ do |path|
  handle_put_delete_and_post(path, request.env, params, 'post') do |params, path|
    FileUtils.mkdir_p(File.join(fixtures_path, path))
    
    plural_file = File.join(fixtures_path, path + ".json")
    objects = JSON.parse(File.read(plural_file)) rescue []
    object = params.merge({:id => objects.length + 1})
    objects.push(object)
    File.open(plural_file, "w") do |f|
      f << objects.to_json
    end
    
    singular_file = File.join(fixtures_path, path, object[:id].to_s + ".json")
    File.open(singular_file, "w") do |f|
      f << object.to_json
    end
    object.to_json
  end
end

put /\/(.+)/ do |path|
  handle_put_delete_and_post(path, request.env, params, 'put') do
    type, id = path.split('/')
    params.delete('id')
    
    plural_file = File.join(fixtures_path, type + ".json")
    objects = JSON.parse(File.read(plural_file)) rescue []
    objects.select{|obj| obj['id'] == id.to_i}.first.merge!(params)
    File.open(plural_file, "w") do |f|
      f << objects.to_json
    end
    
    singular_file = File.join(fixtures_path, path + ".json")
    object = JSON.parse(File.read(singular_file)) rescue {}
    object.merge!(params)
    File.open(singular_file, "w") do |f|
      f << object.to_json
    end
    object.to_json
  end
end

delete /\/(.+)/ do |path|
  handle_put_delete_and_post(path, request.env, params, 'delete') do
    type, id = path.split('/')
    
    plural_file = File.join(fixtures_path, type + ".json")
    objects = JSON.parse(File.read(plural_file)) rescue []
    objects.delete_if{|obj| obj['id'] == id.to_i}
    File.open(plural_file, "w") do |f|
      f << objects.to_json
    end
    
    FileUtils.rm_rf(File.join(fixtures_path, path + ".json"))
    '{}'
  end
end

get /\/(.+)/ do |path|
  protected!
  content_type :json
  file = ROOT + "/features/fixtures/#{URI.decode(path).gsub(' ', '_')}.json"
  results = File.exists?(file) ? JSON.parse(File.read(file)) : []  
  results = sort(results, params[:sort]) if params[:sort]
  results = filter(results, params[:filter]) if params[:filter]
  results.reverse! if params[:reverse]
  results = paginate(results, params[:page], params[:per_page]) if params[:page]  
  results.to_json
end