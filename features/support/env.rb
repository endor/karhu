require 'rubygems'
require 'json'
require 'capybara/cucumber'
require File.dirname(__FILE__) + '/testapp'
require 'test/unit'
require 'test/unit/assertions'
include Test::Unit::Assertions

Capybara.app = Sinatra::Application

Capybara.register_driver :firefox_custom do |app|
  require 'selenium/webdriver'
  profile_path = File.dirname(__FILE__) + "/prototype_profile"
  profile = Selenium::WebDriver::Firefox::Profile.new(profile_path)
  driver = Capybara::Selenium::Driver.new(app, :profile => profile)
  driver
end

Capybara.default_driver = :firefox_custom

Symbol.class_eval do
  def to_proc
    Proc.new{|object| object.send(self)}
  end
end unless :symbol.respond_to?(:to_proc)

Before do
  FileUtils.rm_rf(fixtures_path)
  FileUtils.mkdir_p(fixtures_path)
end

def patiently(&block)
  cycles = 0
  begin
    yield
  rescue  => e
    cycles += 1
    sleep 0.1
    if cycles < 10
      retry 
    else
      raise e
    end
  end
end

def fixtures_path
  File.dirname(__FILE__) + '/../fixtures'
end