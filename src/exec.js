const docker = require("./docker");
const { parseVars } = require("./util");

function exec(script, image, flags) {
  const environmentVars = flags.env ? parseVars(flags.env) : [];
  const commands = [].concat(
    environmentVars.map(x => `export ${x}`),
    "set -e",
    script
  );
  docker.run(commands, image, flags.dryRun, flags.interactive, flags.workDir, flags.ignoreFolder);
}

module.exports.exec = exec;
