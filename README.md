# description

deploy-dist 是一个ftp工具，用于部署web项目。

# install

```
npm install deploy-dist -g
```

# usage

``` bash
# 远程服务器配置项文件在 用户目录下的.deploy-dist.yml
# 增加一个远程服务器的配置项
deploy-dist account -a

# 删除一个远程服务器的配置项
deploy-dist account -r <ip>

# 列出所有以配置的远程服务器的配置项
deploy-dist account -l

# 项目部署配置文件在项目目录下的deploy-dist.yml
# 增加一个当前项目的部署配置
deploy-dist add

# 部署一个环境的代码
deploy-dist deploy <env>

```
