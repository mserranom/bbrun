const docker = require('./docker'),
  { parseVars, load } = require('./environment');

function exec (script, image, flags) {
  let environmentVars = [];
  if (flags.env) {
    if (flags.env.includes('=')) {
      environmentVars = parseVars(flags.env);
    }
    // try if env is file
    else {
      environmentVars = load(flags.env);
    }
  }

  const commands = [].concat(
    environmentVars.map((x) => { return x && (x.includes('export') ? x : `export ${x}`); }),
    'set -e',
    script
  );
  docker.run(commands, image, flags.dryRun, flags.interactive, flags.workDir);
}

module.exports.exec = exec;
