const docker = require("./docker");
const { parseVars, load } = require("./environment");

function exec(script, image, flags) {
  let environmentVars = flags.env ? parseVars(flags.env) : [];
  if (flags.envfile) {
    let loadEnvVars = load(flags.envfile);
    environmentVars = environmentVars.concat(loadEnvVars);
  }
  const commands = [].concat(
    environmentVars.map((x) => { return x && (x.includes('export') ? x : `export ${x}`); }),
    'set -e',
    script
  );
  console.log(commands);
  docker.run(commands, image, flags.dryRun, flags.interactive, flags.workDir, flags.ignoreFolder, flags.keepContainer);
}

module.exports.exec = exec;
