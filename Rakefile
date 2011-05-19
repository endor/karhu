unless ARGV.any? {|a| a =~ /^gems/}
  begin
    require 'cucumber/rake/task'
    require 'jasmine'

    load 'jasmine/tasks/jasmine.rake'

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

    task :default => ['cucumber', 'jasmine:ci']
  rescue LoadError
    desc 'cucumber rake task not available (cucumber not installed)'
    task :cucumber do
      abort 'Cucumber rake task is not available. Be sure to install cucumber as a gem or plugin'
    end
  end
end
