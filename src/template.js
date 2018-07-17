"use strict";
const fs = require("fs");
const yaml = require("js-yaml");
const assert = require("check-types").assert;

const BB_TEMPLATE_DOC =
  "https://confluence.atlassian.com/bitbucket/configure-bitbucket-pipelines-yml-792298910.html";

function read(bbTemplate) {
  if (!fs.existsSync(bbTemplate)) {
    throw new Error(`${bbTemplate} can't be found`);
  }

  const bbConfig = yaml.safeLoad(fs.readFileSync(bbTemplate, "utf8"));
  validate(bbConfig);
  return bbConfig;
}

function parse(config) {
  assert.nonEmptyString(config);
  const jsonConfig = yaml.safeLoad(config);
  validate(jsonConfig);
  return jsonConfig;
}

function findPipeline(config, pipeline, pipelineName) {
  assert.nonEmptyObject(config);
  assert.nonEmptyString(pipeline);

  if (pipeline === "default") {
    if (!config.pipelines.default) {
      throw new Error("default pipeline not found");
    } else {
      return config.pipelines.default;
    }
  } else {
    assert.nonEmptyString(pipelineName);
    assert.nonEmptyObject(
      config.pipelines[pipeline],
      `pipeline "${pipeline}" not found`
    );
    return config.pipelines[pipeline][pipelineName];
  }
}

function findNamedStep(config, stepName, pipeline, pipelineName) {
  assert.nonEmptyObject(config);
  assert.nonEmptyString(stepName);
  pipeline = pipeline || "default";

  const pipelineObject = findPipeline(config, pipeline, pipelineName);
  assert.nonEmptyArray(
    pipelineObject,
    `pipeline "${pipeline}:${pipelineName}" not found`
  );

  const stepObject = findStepInPipeline(pipelineObject, stepName);
  assert.nonEmptyObject(
    stepObject,
    `couldn't find step with name="${stepName}"`
  );
  return stepObject.step;
}

function findStepInPipeline(pipeline, stepName) {
  for (let i = 0; i < pipeline.length; i++) {
    if (pipeline[i].step && pipeline[i].step.name === stepName) {
      return pipeline[i];
    } else if (pipeline[i].parallel) {
      return findStepInPipeline(pipeline[i].parallel, stepName);
    }
  }
}

function validate(config) {
  try {
    assert.nonEmptyObject(
      config,
      "build configuration is empty or invalid yaml"
    );
    assert.nonEmptyObject(
      config.pipelines,
      "'pipelines' section invalid or not found"
    );
  } catch (error) {
    throw new Error(
      `${error.message}\nMalformed template, check ${BB_TEMPLATE_DOC}`
    );
  }
}

module.exports.read = read;
module.exports.findNamedStep = findNamedStep;
module.exports.findPipeline = findPipeline;
module.exports.parse = parse;
module.exports.validate = validate;
