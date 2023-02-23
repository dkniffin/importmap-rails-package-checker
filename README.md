# importmap-rails package consistency checker

While starting to use importmap-rails, I discovered several places where tools were still requiring packages to be defined in package.json/yarn.lock. For example:

* Depfu/dependabot for package versions, and for vulnerability checking
* Jest for JS unit testing
* Istanbul (with Jest) for unit test coverage)

So I've decided to keep my package.json/yarn.lock setup and include all the importmap packages in there as well. However, this means those packages and their versions are duplicated in two places, which could result in them getting out of sync. For example, I might update the version in importmap.rb and forget to update it in package.json. Or Depfu might suggest an update and I'd forget to update importmap.rb

This gist is my solution to that. Here's what it does:
1. I leverage [Danger](https://danger.systems/ruby/) for reporting these inconsistencies to Github
2. Danger runs a script via yarn, which calls out to node. The reason I used node is I needed access to [@yarnpkg/lockfile](https://github.com/yarnpkg/yarn/tree/master/packages/lockfile) and to [npm semver](https://github.com/npm/node-semver).
3. The JS script has an mjs extension because that's required for running ES modules in node
4. The script reads in `config/importmap.rb` (via a new importmap-rails command I proposed [here](https://github.com/rails/importmap-rails/pull/178)) and `yarn.lock`, parses the versions out of both, and compares them using npm's semver, to see if they are compatible. If they're not, it reports that (and includes the line number for better DX on the PR).
5. Finally, Danger parses that output and reports it to Github.

I would love to see this functionality built into `importmap-rails`, but it doesn't seem like that's the case currently, so this was my workaround. I figured I would share it in case anyone else finds it useful.

## Usage

This repo is not intended to work as-is. It is an example of how this could be done. If you're interested in trying it out, I suggest you go through each of the files here, understand what they're doing and why, and integrate the code into your Rails project manually.
