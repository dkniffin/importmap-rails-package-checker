##### Ensure importmap versions are compatible with package.json

if pr_files.include?("yarn.lock") || pr_files.include?("config/importmap.rb")
  importmap_packages = `bin/importmap packages`.chomp.split("\n").map(&:split).to_h
  importmap_packages.each do |package_name, importmap_version|
    output = `yarn --silent list --depth=0 | grep " #{package_name}@"`.chomp
    next if $? != 0
    matches = Regexp.new("#{package_name}@(.*)").match(output)
    next unless matches
    yarn_version = matches[1]
    if importmap_version != yarn_version
      warn("Package '#{package_name}' version '#{importmap_version}' does not match yarn.lock version '#{yarn_version}'", file: "config/importmap.rb")
    end
  end
end
