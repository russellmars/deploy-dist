var YAML = require('yamljs');
var fs = require('fs');
var fsExistsSync = require('./fsExistsSync')

module.exports = function (path) {
  if (!fsExistsSync(path)) {
    return null
  }
  return YAML.parse(fs.readFileSync(path).toString());
}
