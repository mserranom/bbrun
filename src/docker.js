"use strict";
const exec = require("shelljs").exec;
const pwd = require("shelljs").pwd;
const child_process = require("child_process");

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

function run(commands, image, dryRun, interactive) {
  const script = commands.join(" && ");
  const cmd = interactive
    ? `run -P -it --entrypoint /bin/bash -v ${pwd()}:/ws -w /ws ${image}`
    : `run -P -v ${pwd()}:/ws -w /ws ${image} ${script}`;
  if (dryRun) {
    console.log(`shell:\n  docker ${cmd}`);
  } else if (interactive) {
    child_process.execFileSync("docker", cmd.split(" "), {
      stdio: "inherit"
    });
  } else {
    exec(`docker ${cmd}`, { async: false });
  }
}

module.exports.checkExists = checkExists;
module.exports.run = run;
