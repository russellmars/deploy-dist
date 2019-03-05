var fs = require('fs')
var YAML = require('yamljs')

module.exports = function (path, data, callback) {
  fs.writeFile(path, YAML.stringify(data, 4, 2), callback)
}
