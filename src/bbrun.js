const docker = require("./docker");
const template = require("./template");
const { extractPipelineName } = require("./util");
const { exec } = require("./exec");
const assert = require("check-types").assert;

const BB_TEMPLATE = "bitbucket-pipelines.yml";
const BB_IMAGE = "atlassian/default-image:latest";

module.exports = function(options, stepName) {
  options.template = options.template || BB_TEMPLATE;
  options.pipeline = options.pipeline || "default";
  options.workDir = options.workDir || "/ws";

  const config = template.read(options.template);
  const image = config.image || BB_IMAGE;
  const { pipeline, pipelineName } = extractPipelineName(options.pipeline);
  docker.checkExists();

  if (stepName) {
    const step = template.findNamedStep(
      config,
      stepName,
      pipeline,
      pipelineName
    );
    execStep(step);
  } else {
    const steps = template.findPipeline(config, pipeline, pipelineName);
    steps.forEach(x => {
      if (x.step) {
        execStep(x.step);
      } else if (x.parallel) {
        x.parallel.forEach(parallelStep => execStep(parallelStep.step));
      }
    });
  }

  function execStep(step) {
    assert.nonEmptyArray(
      step.script,
      `"script" section not found in step:\n${JSON.stringify(step, null, 4)}`
    );
    const dockerImage = step.image || image;
    const imageName = docker.extractImageName(dockerImage);
    console.log(
      `executing step${stepName ? ` "${stepName}"` : ""} in "${imageName}"`
    );
    exec(step.script, imageName, options);
  }
};
