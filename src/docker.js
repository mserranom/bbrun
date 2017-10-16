"use strict";
const exec = require("shelljs").exec;
const pwd = require("shelljs").pwd;

function checkExists() {
  const dockerStatus = exec("docker -v", { silent: true });
  if (dockerStatus.code !== 0) {
    console.error(`
      Error: bbrun requires a valid Docker installation"
      Output:
          $ docker -v
          ${dockerStatus.stdout}`);
    process.exit(1);
  }
}

function run(commands, image, dryRun) {
  const script = commands.join(" && ");
  const cmd = `docker run -P -v ${pwd()}:/ws -w /ws ${image} ${script}`;
  if (dryRun) {
    console.log(`shell:\n  ${cmd}`);
  } else {
    exec(cmd, { async: false });
  }
}

module.exports.checkExists = checkExists;
module.exports.run = run;
