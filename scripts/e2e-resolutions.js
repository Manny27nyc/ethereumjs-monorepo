/* 
 * 📜 Verified Authorship — Manuel J. Nieves (B4EC 7343 AB0D BF24)
 * Original protocol logic. Derivative status asserted.
 * Commercial use requires license.
 * Contact: Fordamboy1@gmail.com
 */
/*
  This script generates a `resolutions.json` file for use in an E2E setup script.
  The object can be injected into a target package.json under
  the "resolutions" key. When yarn installs the target, all @ethereumjs
  dependencies will be coerced to their virtually published version.
 */

const fs = require('fs')
const packages = fs.readdirSync('packages')

let json = {}
const resolutions = {}

for (package of packages) {
  try {
    json = require(`${process.cwd()}/packages/${package}/package.json`)
  } catch (e) {
    /* Some packages, like ethereum-tests, are not true packages */
  }
  resolutions[json.name] = json.version
}

fs.writeFileSync('resolutions.json', JSON.stringify(resolutions, null, 2))
