require 'sinatra'
require File.dirname(__FILE__) + "/../lib/proxy"
require "test/unit"
require "rack/test"

include Rack::Test::Methods

def app
  Sinatra::Application
end

describe 'get' do
  before(:each) do
    app.remote_api_base_url = 'http://example.com'
  end
  
  it "should not get the resource from the remote api if it's a static file" do
    HTTParty.should_not_receive(:get)
    get('/index.html')
  end
  
  it "should forward the authentication header to the api" do
    header 'X-Naama-Authentication', '123'
    HTTParty.should_receive(:get).with(anything, {:headers => {'X-Naama-Authentication' => '123'}})
    get('/dl/23')
  end
  
  it "should get the resource from the remote api" do
    HTTParty.should_receive(:get).with('http://example.com/dl/23', anything)
    get('/dl/23')
  end
  
  it "should encode the uri" do
    HTTParty.should_receive(:get).with('http://example.com/dl/23%2045', anything)
    get('/dl/23%2045')
  end
  
  it "should send the body from the remote api" do
    HTTParty.stub!(:get => stub('response', :body => 'abc', :code => 200))
    get('/dl/23')
    last_response.body.should == 'abc'
  end
  
  it "should send the status code from the remote api" do
    HTTParty.stub!(:get => stub('response', :code => 304).as_null_object)
    get('/dl/23')
    last_response.status.should == 304
  end
end

describe 'write to api', :shared => true do
  before(:each) do
    app.remote_api_base_url = 'http://example.com'
  end
  
  it "should post to the remote api" do
    HTTParty.should_receive(http_method).with('http://example.com/o/23', anything)
    write('/o/23')
  end
  
  it "should forward the authentication header to the api" do
    header 'X-Naama-Authentication', '123'
    HTTParty.should_receive(http_method).with(anything, {:query => anything, :headers => {'X-Naama-Authentication' => '123'}})
    write('/o/23')
  end
  
  it "should not forward an authentication header if there is none" do
    HTTParty.should_receive(http_method).with(anything, {:query => anything, :headers => {}})
    write('/o/23')
  end
  
  it "should pass the params to the api" do
    HTTParty.should_receive(http_method).with(anything, {:query => {'name' => 'joe'}, :headers => anything})
    write '/o/23', {'name' => 'joe'}
  end
  
  it "should send the body from the remote api" do
    HTTParty.stub!(http_method => stub('response', :body => 'abc', :code => 200))
    write('/o/23')
    last_response.body.should == 'abc'
  end
  
  it "should send the status code from the remote api" do
    HTTParty.stub!(http_method => stub('response', :code => 304).as_null_object)
    write('/o/23')
    last_response.status.should == 304    
  end
end

describe "post" do
  let(:http_method) {:post}
  def write(*args)
    post(*args)
  end
    
  it_should_behave_like 'write to api'
end
  
describe "put" do
  let(:http_method) {:put}
  def write(*args)
    put(*args)
  end
    
  it_should_behave_like 'write to api'
end

describe "put" do
  let(:http_method) {:delete}
  def write(*args)
    delete(*args)
  end
    
  it_should_behave_like 'write to api'
end