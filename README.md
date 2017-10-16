# BBRun
`bbrun` is a small command line tool to execute [Bitbucket Pipelines](https://confluence.atlassian.com/bitbucket/configure-bitbucket-pipelines-yml-792298910.html) locally.

## Usage
```bash
  Usage
      $ bbrun <step> <options>

	Options
      --template, pipeline template, defaults to "bitbucket-pipelines.yml"
      --env,  define environment variables for execution
      --save-env, saves an environment variable in env-file
      --env-file, file storing environment variables, defaults to "~/.bbrun"
      --dry-run,  performs dry run, printing the docker command
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
```

## Build and Test
`npm install && npm test`