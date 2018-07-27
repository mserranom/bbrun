const { parse, Template } = require("../src/template");

describe("Template", () => {
  it("finds the step by name on the default pipeline", () => {
    const config = parse(`
            image: ubuntu
            pipelines:
                default:
                    - step:
                        name: step1
                        script:
                            - echo "testing step1"
                    - step:
                        name: step2
                        script:
                            - echo "testing step2"
            
        `);

    const template = new Template(config);
    const step = template.getPipeline().getStep("step2").step;
    expect(step).toMatchObject({
      name: "step2",
      script: ['echo "testing step2"']
    });
  });
  it("finds the step by name on the tags pipeline", () => {
    const config = parse(`
            image: ubuntu
            pipelines:
                default:
                    - step:
                        name: step1
                        script:
                            - echo "testing step1"
                tags:
                    v2:
                        - step:
                            name: step2
                            script:
                                - echo "testing step2"
            
        `);
    const template = new Template(config);
    const step = template.getPipeline("tags:v2").getStep("step2").step;
    expect(step).toMatchObject({
      name: "step2",
      script: ['echo "testing step2"']
    });
  });
});
