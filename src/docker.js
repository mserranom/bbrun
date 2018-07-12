"use strict";
const exec = require("shelljs").exec;
const pwd = require("shelljs").pwd;
const fs = require("fs");
const child_process = require("child_process");

const BUILD_SCRIPT = ".bbrun.sh";

function deleteBuildScript() {
  if (fs.existsSync(BUILD_SCRIPT)) {
    fs.unlinkSync(BUILD_SCRIPT);
  }
}

function prepareBuildScript(commands) {
  deleteBuildScript();
  const script = "#!/usr/bin/env bash\n" + commands.join("\n");
  fs.writeFileSync(BUILD_SCRIPT, script);
}

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

function run(commands, image, dryRun, interactive, workDir) {
  const cmd = interactive
    ? `run -P -it --entrypoint=/bin/bash -v ${pwd()}:${workDir} -w ${workDir} ${image}`
    : `run  -P -v ${pwd()}:${workDir} -w ${workDir} ${image} sh ${BUILD_SCRIPT}`;

  if (dryRun) {
    console.log(`docker command:\n\tdocker ${cmd}`);
    console.log(`build script:\n\t${commands.join("\n\t")}`);
  } else if (interactive) {
    console.log(`opening shell for image "${image}, run "s"`);
    child_process.execFileSync("docker", cmd.split(" "), {
      stdio: "inherit"
    });
  } else {
    prepareBuildScript(commands);
    exec(`docker ${cmd}`, { async: false });
    deleteBuildScript();
  }
}

function extractImageName(image) {
  if (typeof image === "string" || image instanceof String) {
    return image;
  } else if (image.name) {
    return image.name;
  } else {
    throw new Error(`"${JSON.stringify(image)}" is not a valid image`);
  }
}

module.exports.checkExists = checkExists;
module.exports.run = run;
module.exports.extractImageName = extractImageName;
