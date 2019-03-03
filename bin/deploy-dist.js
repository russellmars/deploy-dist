#!/usr/bin/env node
'use strict';

var deploy = require('../lib/index')
var program = require('commander');
var path = require('path');
var getYamlFileData = require('../lib/util/getYamlFileData')
var findIndex = require('../lib/util/findIndex')
var writeYamlFile = require('../lib/util/writeYamlFile')
var question = require('../lib/util/question')
var fsExistsSync = require('../lib/util/fsExistsSync')
var PKG = require('../package.json');

var USER_HOME = process.env.HOME || process.env.USERPROFILE
var configFile = path.join(process.cwd(), 'deploy-dist.yml')
var accountFile = path.join(USER_HOME, '.deploy-dist.yml')

var existConfigFile = fsExistsSync(configFile)  // config文件是否存在
var existAccountFile = fsExistsSync(accountFile)  // account config 文件是否存在

program.version(PKG.version, '-v, --version')
  .option('-d, --deploy <env>', 'Deploy dist for env config')
  .option('-a, --add', 'Add a deploy config')
  .description('Deploy or Add a deploy config')
  .action(function(cmd, cmd2) {
    if (cmd.deploy) {
      handleDeploy(cmd.deploy)
    } else if (cmd.add) {
      handleAddDeploy()
    }
  })
  .parse(process.argv);

/**
 * --version 版本
 * account [--add] [--list] [--remove]
 */
program
  .command('account')
  .option('-a, --add', 'Add account')
  .option('-r, --remove <ip>', 'Remove account')
  .option('-l, --list', 'List accounts')
  .name('deploy-dist')
  .description('Add, Remove, Or List Account')
  .action(function(cmd, cmd2) {
    if (cmd.add) {
      addAccount()
    } else if (cmd.remove) {
      deleteAccount(cmd.remove)
    } else if (cmd.list) {
      listAccount()
    }
  });

program
  .command('help', { isDefault: true })
  .description('Print this help')
  .action(function () {
      program.outputHelp();
  });
program
  .parse(process.argv);

if (process.argv.length === 2) {
  program.outputHelp();
}

/**
 * 列出所有账户配置
 */
function listAccount () {
  var data = getYamlFileData(accountFile)
  if (data && data instanceof Array) {
    data.forEach(a => {
      console.log(a.ip)
    });
  }
}

/**
 * 添加账户配置
 */
function addAccount () {
  var data = getYamlFileData(accountFile) || []

  question([
    'input remote ip: ',
    'input remote user: ',
    'input remote pass: '
  ], function (answers) {
    var ip = answers[0]
    var user = answers[1]
    var pass = answers[2]

    var index = findIndex(data, function (item) {
      return item.ip === ip
    })
    if (index > -1) {
      data.splice(index, 1)
    }
    data.push({
      ip: ip,
      user: user,
      pass: pass
    })

    writeYamlFile(accountFile, data, function (err) {
      if (err) {
        console.log('add fail:' + err)
        return 
      }
      console.log('add successfully')
    })
  })
}

// 删除账号
function deleteAccount (ip) {
  var data = getYamlFileData(accountFile) || []
  var index = findIndex(data, function(item) {
    return item.ip === ip
  })
  if (index > -1) {
    data.splice(index, 1)
    writeYamlFile(accountFile, data, function(err) {
      if (err) {
        console.log('delete fail:' + err)
        return 
      }
      console.log('delete successfully')
    })
  }
}

/**
 * 处理部署命令
 */
function handleDeploy(env) {
  if (!existAccountFile) {
    console.log('please add a deploy account, use: \n deploy-dist add')
    return
  }
  if (!existConfigFile) {
    console.log('please create deploy-dist.yml file')
    return
  }
  var configData = getYamlFileData(configFile)
  var accountData = getYamlFileData(accountFile)

  var envs = configData.envs
  var config = envs[env]

  if (config) {
    var ip = config.ip
    var account
    var index = findIndex(accountData, function(item) {
      return item.ip === ip
    })
    if (index > -1) {
      account = accountData[index]
    }
    if (!account) {
      console.log('please add account for ip ' + ip)
      return
    }
    deploy(config, account)
  }
}

function handleAddDeploy() {
  console.log(12312313)
  var data = getYamlFileData(configFile) || {
    envs: {}
  }

  question([
    'input env name: ',
    'input ip: ',
    'input port: ',
    'input dir: ',
    'input remoteDir: '
  ], function (answers) {
    var envName = answers[0]
    var ip = answers[1]
    var port = answers[2]
    var dir = answers[3]
    var remoteDir = answers[4]

    data.envs[envName] = {
      ip: ip,
      port: parseInt(port || 22),
      dir: dir,
      remoteDir: remoteDir
    }

    writeYamlFile(configFile, data, function (err) {
      if (err) {
        console.log('add fail:' + err)
        return 
      }
      console.log('add successfully')
    })
  })
}