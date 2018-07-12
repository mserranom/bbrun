# Bitbucket Pipelines Runner

`bbrun` is a command line tool to execute [Bitbucket Pipelines](https://confluence.atlassian.com/bitbucket/configure-bitbucket-pipelines-yml-792298910.html) locally.

[![Build Status](https://travis-ci.org/mserranom/bbrun.svg?branch=master)](https://travis-ci.org/mserranom/bbrun)

## Install

Install `bbrun` with `npm`:

```bash
$ npm install -g bbrun
```

## Usage

`bbrun` can execute any step defined in your `bitbucket-pipelines.yml` template:

```yaml
pipelines:
  default:
    - step:
          name: hello
          image: ubuntu2
          script:
            - echo "hello world!"
```

Run `bbrun` straight from your project path:

```bash
$ bbrun hello
running "build" in "atlassian/default-image" image...
hello world!
```

### Options

```
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
```

## Caveats

- Not all Bitbucket features are covered, check [open issues](https://github.com/mserranom/bbrun/issues) for an overview of the roadmap.
- [Private images](https://confluence.atlassian.com/bitbucket/use-docker-images-as-build-environments-792298897.html) are supported, but the user has to login in the Docker Registry before executing `bbrun` (thus credentials in the file are ignored).

## Build and Test

```bash
npm install && npm test
```

### Install locally

```bash
$ npm install && npm link
```
