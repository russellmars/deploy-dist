'use strict';
var path = require('path')
var node_ssh = require('node-ssh')
/**
 * config: { ip, port, dir, remoteDir }
 * account: { ip, user, pass }
 */
module.exports = function (config, account) {
  var ssh = new node_ssh()
    
  ssh.connect({
    host: config.ip,
    port: config.port,
    password: account.pass,
    username: account.user
  }).then((result) => {
    var failed = []
    var successful = []
    console.log('local path: ' + path.join(process.cwd(), config.dir))
    console.log('remote path: ' + config.remoteDir)
    ssh.putDirectory(path.join(process.cwd(), config.dir), config.remoteDir, {
      recursive: true,
      concurrency: 3,
      tick: function(localPath, remotePath, error) {
        if (error) {
          failed.push(localPath)
        } else {
          successful.push(localPath)
        }
      }
    }).then(function(status) {
      console.log(config.dir + ' directory transfer was', status ? 'successful' : 'unsuccessful')
      if (failed.length > 0) {
        console.log('failed transfers:\n', failed.join('\n'))
      }
      ssh.dispose()
    }).catch(err => {
      console.log('catch')
      console.log(err)
      ssh.dispose()
    })
  })
}