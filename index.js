#!/usr/bin/env node

"use strict";
const meow = require("meow");
const bbrun = require("./src/bbrun");

const cli = meow(
  `
Usage
  $ bbrun <step> <options>

Options
    --template (-t), pipeline template, defaults to "bitbucket-pipelines.yml"
    --env (-e),  define environment variables for execution
    --dry-run (-d),  performs dry run, printing the docker command
    --interactive (-i), starts an interactive bash session in the container
    --help, prints this very guide

Examples:
  Execute all steps in the default pipeline from bitbucket-pipelines.yml
    $ bbrun
    $ bbrun --template bitbucket-template.yml
    $ bbrun --pipeline default
  Execute a single step by its name
    $ bbrun test
    $ bbrun "Integration Tests"
  Execute steps from different pipelines
    $ bbrun test --pipeline branches:master
  Define an environment variable
    $ bbrun test --env EDITOR=vim
    $ bbrun test --env "EDITOR=vim, USER=root"
`,
  {
    flags: {
      pipeline: {
        type: "string",
        alias: "p"
      },
      template: {
        type: "string",
        alias: "t"
      },
      env: {
        type: "string",
        alias: "e"
      },
      interactive: {
        type: "boolean",
        alias: "i"
      },
      "dry-run": {
        type: "boolean",
        alias: "d"
      }
    }
  }
);

try {
  bbrun(cli.flags, cli.input[0]);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
