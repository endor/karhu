ROOT = File.dirname(__FILE__) + '/../..'

require 'rubygems'
require 'sinatra'
require 'json'
require 'uri'
require 'will_paginate'
require ROOT + "/lib/authentication"
require ROOT + "/lib/helpers"

set :static, true
set :public, ROOT + '/public'
set :logging, false

get '/' do
  redirect "/index.html"
end

get '/test' do
  'test'
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
    log_request(path, env, params, method)
    path = URI.decode(path).gsub(' ', '_')
    params = cast_values_to_correct_types(params)

    yield(params, path)
  end
  
  def log_request(path, env, params, method)
    file = ROOT + "/features/support/last_requests.log"
    requests = (JSON.parse(File.read(file)) rescue []) || []
    request = {'params' => params, 'path' => path, 'method' => method}
    File.open(file, "w") do |f|
      f << (requests << request).to_json
    end
  end
end

get('/config.js') do
  File.read(ROOT + '/config/test.js')
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
  if params[:page]
    paginated_results = results.paginate(:page => params[:page], :per_page => params[:per_page]) 
    results = {
      :current_page => paginated_results.current_page,
      :total_pages => paginated_results.total_pages,
      :total_entries => paginated_results.total_entries,
      :per_page => (params[:per_page] || 30),
      :values => paginated_results.to_a
    }
  end
  results.to_json
end