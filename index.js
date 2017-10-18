#!/usr/bin/env node

"use strict";
const meow = require("meow");
const fs = require("fs");
const os = require("os");
const exec = require("shelljs").exec;
const docker = require("./src/docker");
const template = require("./src/template");
const env = require("./src/environment");
const pwd = require("shelljs").pwd;

const BB_TEMPLATE = "bitbucket-pipelines.yml";
const BB_ENV = `${os.homedir()}/.bbrun`;

const cli = meow(
  `
	Usage
	  $ bbrun <step> <options>

	Options
      --template, pipeline template, defaults to "bitbucket-pipelines.yml"
      --env,  define environment variables for execution
      --save-env, saves an environment variable in env-file
      --env-file, file storing environment variables, defaults to "~/.bbrun"
      --dry-run,  performs dry run, printing the docker command
      --interactive, starts an interactive /bin/bash session in the container
      --help, prints this very guide

    Examples:
      Execute all steps defined in ./bitbucket-pipelines.yml
        $ bbrun
        $ bbrun --template bitbucket-template.yml
      Execute a single step by name
        $ bbrun test
        $ bbrun test "Build and test"
      Execute a step using an environment variable
        $ bbrun test --env EDITOR=vim
        $ bbrun test --env EDITOR=vim,FOO=bar
      Define a global environment variable and save it in ~/.bbrun
        $ bbrun --save-env EDITOR=vim
`,
  {
    flags: {
      env: {
        type: "string",
        alias: "e"
      },
      "save-env": {
        type: "string",
        alias: "s"
      },
      template: {
        type: "string",
        alias: "t"
      },
      "dry-run": {
        type: "boolean",
        alias: "d"
      },
      template: {
        type: "string",
        alias: "t"
      },
      "env-file": {
        type: "string",
        alias: "f"
      },
      interactive: {
        type: "boolean",
        alias: "i",
        default: false
      }
    }
  }
);

const stepToRun = cli.input[0];

const templateInput = cli.flags.template || BB_TEMPLATE;
const envLocation = cli.flags.envFile || BB_ENV;

if (cli.flags.saveEnv) {
  env.save(cli.flags.saveEnv, envLocation);
  process.exit();
}

docker.checkExists();

const bbConfig = template.read(`${pwd()}/${templateInput}`);

const steps = template.getSteps(bbConfig);

if (stepToRun) {
  if (!steps.some(step => step.name === stepToRun)) {
    console.error(`step "${stepToRun}" cannot be found in ${templateInput}`);
    process.exit(1);
  } else {
    execStep(steps.find(step => step.name === stepToRun));
  }
} else if (cli.flags.interactive) {
  console.warn("no step defined, running interactive session for first step");
  execStep(steps[0]);
} else {
  steps.forEach(step => execStep(step));
}

function execStep(stepConfig) {
  const globalEnv = env.load(envLocation);
  const executionEnv = cli.flags.env ? env.parseVars(cli.flags.env) : [];
  const commands = [].concat(
    globalEnv.map(x => `export ${x}`),
    executionEnv.map(x => `export ${x}`),
    stepConfig.script
  );

  console.log(`running "${stepConfig.name}" in "${stepConfig.image}" image`);
  docker.run(
    commands,
    stepConfig.image,
    cli.flags.dryRun,
    cli.flags.interactive
  );
}
