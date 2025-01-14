"use strict";
const fs = require("fs");
const os = require("os");
const exec = require("shelljs").exec;

function save(env, location) {
  //TODO: validate
  fs.appendFileSync(`${location}`, env);
  console.log(`${env} saved to ${location}`);
}

function load(location) {
  if (!fs.existsSync(location)) {
    return [];
  } else {
    return fs.readFileSync(location, "utf8").split("\n");
  }
}

function loadBitbucketEnv() {
  let envArs = [
    'CI=true',
    'BITBUCKET_SSH_KEY_FILE=~/.ssh/id_rsa'
  ];

  // retrieve BITBUCKET_BRANCH
  const commitHash = exec(`git branch --show-current`, { async: false, silent: true });
  if (commitHash.code === 0 && commitHash.stdout) {
    envArs = envArs.concat(`BITBUCKET_BRANCH="${commitHash.stdout.trim()}"`);
  }

  // retrieve BITBUCKET_COMMIT
  const branchName = exec(`git rev-parse HEAD`, { async: false, silent: true });
  if (branchName.code === 0 && branchName.stdout) {
    envArs = envArs.concat(`BITBUCKET_COMMIT="${branchName.stdout.trim()}"`);
  }

  // BITBUCKET_BUILD_NUMBER
  envArs = envArs.concat(`BITBUCKET_BUILD_NUMBER="${between(0,999)}"`);

  return envArs;
}

function parseVars(envArg) {
  return envArg.match(/(?=\b[a-z])\w+=(?:(['"])(?:(?!\1).)*\1|[^,]*)/gi).map(x => x.trim());
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

module.exports.save = save;
module.exports.load = load;
module.exports.parseVars = parseVars;
module.exports.loadBitbucketEnv = loadBitbucketEnv;
