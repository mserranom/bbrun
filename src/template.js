"use strict";
const fs = require("fs");
const yaml = require("js-yaml");

const BB_TEMPLATE_DOC =
  "https://confluence.atlassian.com/bitbucket/configure-bitbucket-pipelines-yml-792298910.html";

function read(bbTemplate) {
  if (!fs.existsSync(bbTemplate)) {
    console.error(`${bbTemplate} can't be found`);
    process.exit(1);
  }

  try {
    const bbConfig = yaml.safeLoad(fs.readFileSync(bbTemplate, "utf8"));

    const isCorrect = bbConfig.pipelines.default.every(
      x =>
        (bbConfig.image || x.step.image) &&
        (x.step.script && x.step.script.length > 0)
    );

    if (!isCorrect) {
      console.error("template has missing 'image' or 'script' configurations");
      process.exit(1);
    }
    return bbConfig;
  } catch (e) {
    console.error(`malformed template, please check ${BB_TEMPLATE_DOC}`);
    process.exit(1);
  }
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

module.exports.read = read;
module.exports.getSteps = getSteps;
