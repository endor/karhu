require 'rubygems'
require 'sinatra'
require 'json'
require 'uri'

ROOT = File.join(File.dirname(__FILE__), '..')
set :static, true
set :public, File.join(ROOT, 'public')
set :logging, false

get '/' do
  redirect "/index.html"
end

get('/config.js') do
  File.read(ROOT + '/config/default.js')
end

helpers do
  def handle_put_delete_and_post(path, env, params, method)
    params.delete('captures')
    path = URI.decode(path).gsub(' ', '_')
    yield(params, path)
    ''
  end
  
  def fixtures_path
    File.join(ROOT, "features", "fixtures")
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
  end
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