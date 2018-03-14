const { parse, findNamedStep } = require("../src/template");

describe("findNamedStep", () => {
  it("finds the step by name on the default pipeline", () => {
    const template = parse(`
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
    const step = findNamedStep(template, "step2");
    expect(step).toMatchObject({
      name: "step2",
      script: ['echo "testing step2"']
    });
  });
  it("finds the step by name on the tags pipeline", () => {
    const template = parse(`
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
    const step = findNamedStep(template, "step2", "tags", "v2");
    expect(step).toMatchObject({
      name: "step2",
      script: ['echo "testing step2"']
    });
  });
  it("throws an error when a step name doesn't exist", () => {
    const template = parse(`
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
    expect(() => findNamedStep(template, "step3")).toThrowError(
      `couldn't find step with name="step3"`
    );
  });
});
