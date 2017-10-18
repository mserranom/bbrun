function run(options) {
  const exec = require("shelljs").exec;
  return exec(`node index.js ${options} --env-file fake_file`, {
    silent: true
  });
}

describe("integration tests", () => {
  describe("single step pipelines", () => {
    it("executes a step in single step pipeline", () => {
      const res = run("test --template test/pipeline-one-step.yml --dry-run");
      expect(res.stdout).toMatchSnapshot();
      expect(res.stderr).toMatchSnapshot();
      expect(res.code).toBe(0);
    });

    it("executes all defined steps in single step pipeline", () => {
      const res = run("--template test/pipeline-one-step.yml --dry-run");
      expect(res.stdout).toMatchSnapshot();
      expect(res.stderr).toMatchSnapshot();
      expect(res.code).toBe(0);
    });

    it("executes all defined steps in single step pipeline with no name", () => {
      const res = run(
        "--template test/pipeline-one-step-no-name.yml --dry-run"
      );
      expect(res.stdout).toMatchSnapshot();
      expect(res.stderr).toMatchSnapshot();
      expect(res.code).toBe(0);
    });

    it("fails when step doesn't exist", () => {
      const res = run(
        "fake_step --template test/pipeline-one-step.yml --dry-run"
      );
      expect(res.stdout).toMatchSnapshot();
      expect(res.stderr).toMatchSnapshot();
      expect(res.code).toBe(1);
    });
  });

  describe("multiple step pipelines", () => {
    it("executes all steps", () => {
      const res = run("--template test/multiple-step-pipeline.yml --dry-run");
      expect(res.stdout).toMatchSnapshot();
      expect(res.stderr).toMatchSnapshot();
      expect(res.code).toBe(0);
    });
  });
});
