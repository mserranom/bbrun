"use strict";
const fs = require("fs");
const os = require("os");

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

function parseVars(envArg) {
  return envArg
    .trim()
    .split(",")
    .map(x => x.trim());
}

module.exports.save = save;
module.exports.load = load;
module.exports.parseVars = parseVars;
