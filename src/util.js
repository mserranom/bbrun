const assert = require("check-types").assert;

function extractPipelineName(pipeline) {
  assert.nonEmptyString(pipeline);
  const index = pipeline.indexOf(":");
  if (index < 0) {
    return {
      pipeline: pipeline,
      pipelineName: ""
    };
  } else {
    return {
      pipeline: pipeline.slice(0, pipeline.indexOf(":")),
      pipelineName: pipeline.slice(pipeline.indexOf(":") + 1)
    };
  }
}

function parseVars(envArg) {
  return envArg
    .trim()
    .split(",")
    .map(x => x.trim());
}

module.exports.extractPipelineName = extractPipelineName;
module.exports.parseVars = parseVars;
