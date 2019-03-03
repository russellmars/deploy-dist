var USER_HOME = process.env.HOME || process.env.USERPROFILE;
var configFile = path.join(process.cwd(), "deploy-dist.yml");
var accountFile = path.join(USER_HOME, ".deploy-dist.yml");

exports.fsExistsSync = function(path) {
  try {
    fs.accessSync(path, fs.F_OK);
  } catch (e) {
    return false;
  }
  return true;
};
