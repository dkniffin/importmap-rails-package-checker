##### Ensure importmap versions are compatible with package.json

package_issues = `yarn --silent check-importmap-yarn-consistency`.split("\n")
package_issues.each do |issue|
  matches = issue.match(/^(.*):(\d+) (.*)/)

  warn(matches[3], file: matches[1], line: matches[2], sticky: true)
end
