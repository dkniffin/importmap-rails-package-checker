import fs from 'fs'
import lockfile from '@yarnpkg/lockfile'
import { exec } from 'child_process'
import semver from 'semver'

// Read in config/importmap.rb
exec("bin/importmap packages", (err, stdout) => {
  if (err) {
    throw "Error: unable to gather importmap packages"
  } else {
    // Parse importmap into Map
    const importmapPackages = new Map(stdout.trim().split("\n").map((pkg) => pkg.split(" ")))

    // Read yarn.lock packages into Map
    const file = fs.readFileSync('yarn.lock', 'utf8')
    const parsed = lockfile.parse(file)
    const yarnPackageStrings = Object.keys(parsed["object"])
    const yarnVersions = new Map(yarnPackageStrings.map((yarnPackageString) => {
      const matches = yarnPackageString.match(new RegExp(`^(.*)@(.*)`))
      return [matches[1], matches[2]]
    }))

    importmapPackages.forEach((importmapVersion, packageName) => {
      const yarnVersion = yarnVersions.get(packageName)

      // Check if the versions are compatible
      if (!semver.satisfies(importmapVersion, yarnVersion)) {
        // Get the linenumber, for reporting
        exec(`grep -n ${packageName} config/importmap.rb | cut -d : -f 1`, (err, stdout) => {
          if (err) { throw "Unexpected error while retrieving line number" }

          const importmapLineNumber = stdout.trim()

          console.log(`config/importmap.rb:${importmapLineNumber} Package '${packageName}' version '${importmapVersion}' is incompatible with yarn.lock version '${yarnVersion}'`)
        })
      }
    })
  }
})
