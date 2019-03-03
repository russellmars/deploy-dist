var fs = require('fs')
var YAML = require('yamljs')

module.exports = function (path, data, callback) {
  console.log(path)
  console.log(data)
  fs.writeFile(path, YAML.stringify(data, 4, 2), callback)
}
