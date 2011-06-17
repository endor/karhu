unless ARGV.any? {|a| a =~ /^gems/}
  begin
    require 'cucumber/rake/task'
    require 'jasmine'

    load 'jasmine/tasks/jasmine.rake'

    namespace :jasmine do
      task :phantomjsci => ["jasmine:require"] do
        phantomjs_runner = File.join(File.dirname(__FILE__), "spec/javascripts/support/run-jasmine.js")
      
        config = Jasmine::Config.new
        js_port = "#{config.jasmine_port}"
        config.start_jasmine_server

        jasmine_url = "#{config.jasmine_host}:" + (js_port.to_i + 1).to_s
        sh "phantomjs #{phantomjs_runner} #{jasmine_url}" do |ok, res|
          fail "Jasmine specs failed" unless ok
        end
      end
    end

    vendored_cucumber_bin = nil
    
    namespace :cucumber do
      Cucumber::Rake::Task.new(:ok, 'Run features that should pass') do |t|
        t.binary = vendored_cucumber_bin
        t.fork = true
        t.profile = 'default'
      end

      Cucumber::Rake::Task.new(:wip, 'Run features that are being worked on') do |t|
        t.binary = vendored_cucumber_bin
        t.fork = true
        t.profile = 'wip'
      end

      Cucumber::Rake::Task.new(:rerun, 'Record failing features and run only them if any exist') do |t|
        t.binary = vendored_cucumber_bin
        t.fork = true
        t.profile = 'rerun'
      end

      desc 'Run all features'
      task :all => [:ok, :wip]
    end
    desc 'Alias for cucumber:ok'
    task :cucumber => 'cucumber:ok'

    task :default => ['cucumber', 'jasmine:phantomjsci']
  rescue LoadError
    desc 'cucumber rake task not available (cucumber not installed)'
    task :cucumber do
      abort 'Cucumber rake task is not available. Be sure to install cucumber as a gem or plugin'
    end
  end
end
