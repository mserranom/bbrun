"use strict";
const fs = require("fs");
const yaml = require("js-yaml");
const assert = require("check-types").assert;

const BB_TEMPLATE_DOC =
  "https://confluence.atlassian.com/bitbucket/configure-bitbucket-pipelines-yml-792298910.html";

function read(bbTemplate) {
  if (!fs.existsSync(bbTemplate)) {
    console.error(`${bbTemplate} can't be found`);
  }

  try {
    const bbConfig = yaml.safeLoad(fs.readFileSync(bbTemplate, "utf8"));
    validate(bbConfig);
    return bbConfig;
  } catch (error) {
    throw new Error(`Malformed template, check ${BB_TEMPLATE_DOC}`);
  }
}

function parse(config) {
  assert.nonEmptyString(config);
  const jsonConfig = yaml.safeLoad(config);
  validate(jsonConfig);
  return jsonConfig;
}

function getSteps(config) {
  return config.pipelines.default.map(x => {
    return {
      script: x.step.script,
      image: x.step.image ? x.step.image : config.image,
      name: x.step.name ? x.step.name : "default"
    };
  });
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

  const stepObject = pipelineObject.find(x => x.step.name === stepName);
  assert.nonEmptyObject(
    stepObject,
    `couldn't find step with name="${stepName}"`
  );
  return stepObject.step;
}

function validate(config) {
  assert.nonEmptyObject(config);
  assert.nonEmptyObject(config.pipelines);

  const validateStep = stepObject => {
    assert.nonEmptyObject(stepObject.step);
    assert.nonEmptyArray(stepObject.step.script);
  };

  const validatePipelineDefinitions = pipelineDefinition => {
    assert.nonEmptyArray(pipelineDefinition);
    pipelineDefinition.forEach(step => validateStep(step));
  };
}

module.exports.read = read;
module.exports.getSteps = getSteps;
module.exports.findNamedStep = findNamedStep;
module.exports.findPipeline = findPipeline;
module.exports.parse = parse;
module.exports.validate = validate;
