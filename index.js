#!/usr/bin/env node

"use strict";
const meow = require("meow");
const bbrun = require("./src/bbrun");

const cli = meow(
  `
	Usage
	  $ bbrun <step> <options>

	Options
      --template, pipeline template, defaults to "bitbucket-pipelines.yml"
      --env,  define environment variables for execution
      --dry-run,  performs dry run, printing the docker command
      --interactive, starts an interactive /bin/bash session in the container
      --help, prints this very guide

    Examples:
      Execute all steps defined in ./bitbucket-pipelines.yml
        $ bbrun
        $ bbrun --template bitbucket-template.yml
      Execute a single step by name
        $ bbrun test
        $ bbrun "Build and test"
        $ bbrun --pipeline "tags:v1.3.4"
      Execute a step using an environment variable
        $ bbrun test --env EDITOR=vim
        $ bbrun test --env EDITOR=vim,FOO=bar
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
