function run(options) {
  const exec = require("shelljs").exec;
  return exec(`node index.js ${options}`, {
    silent: true
  });
}

const PWD = require("shelljs").pwd();

const norm = input => input.replace(new RegExp(PWD, "g"), "PWD");

describe("single step pipeline", () => {
  it("executes the default step with no arguments", () => {
    const res = run(
      "--template test/templates/pipeline-one-step.yml --dry-run"
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });

  it("executes the step by name", () => {
    const res = run(
      "test --template test/templates/pipeline-one-step.yml --dry-run"
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });

  it("fails executing non-existing name", () => {
    const res = run(
      "foo --template test/templates/pipeline-one-step.yml --dry-run"
    );
    expect(norm(res.stdout)).toBe("");
    expect(res.stderr).toBe('couldn\'t find step with name="foo"\n');
    expect(res.code).toBe(1);
  });
});

it("invalid template should fail", () => {
  const res = run("--template test/templates/invalid-template.yml --dry-run");
  expect(norm(res.stdout)).toBe("");
  expect(res.stderr).toMatchSnapshot();
  expect(res.code).toBe(1);
});

it("no image template should use default atlassian image", () => {
  const res = run("--template test/templates/no-image-template.yml --dry-run");
  expect(norm(res.stdout)).toMatchSnapshot();
  expect(res.stderr).toBe("");
  expect(res.code).toBe(0);
});

it("should resolve private image names", () => {
  const res = run(
    "--template test/templates/private-image-template.yml --dry-run"
  );
  expect(norm(res.stdout)).toMatchSnapshot();
  expect(res.stderr).toBe("");
  expect(res.code).toBe(0);
});

describe("template with multiple steps in the default pipeline", () => {
  it("should execute all the default steps when no argument is provided", () => {
    const res = run(
      "--template test/templates/pipeline-multiple-steps.yml --dry-run"
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
  it("should execute a single step by name", () => {
    const res = run(
      "step2 --template test/templates/pipeline-multiple-steps.yml --dry-run"
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
  it("should execute a single step by name with spaces in the name", () => {
    const res = run(
      '"Step Three" --template test/templates/pipeline-multiple-steps.yml --dry-run'
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
  it("should execute a named step in a branch", () => {
    const res = run(
      "master_step_2 --pipeline branches:master --template test/templates/pipeline-multiple-steps.yml --dry-run"
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
  it("should understand asterisk branches", () => {
    const res = run(
      '"branch step 2" --pipeline branches:** --template test/templates/pipeline-multiple-steps.yml --dry-run'
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
  it("should execute all the steps in a branch if no step provided", () => {
    const res = run(
      "--pipeline branches:master --template test/templates/pipeline-multiple-steps.yml --dry-run"
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
});

it("template with no default should fail when no step name is passed", () => {
  const res = run(
    "--template test/templates/no-default-pipeline.yml --dry-run"
  );
  expect(norm(res.stdout)).toBe("");
  expect(res.stderr).toBe("default pipeline not found\n");
  expect(res.code).toBe(1);
});

describe("environment variables", () => {
  it("single variable is added to the script", () => {
    const res = run(
      "--env foo=bar --template test/templates/pipeline-one-step.yml --dry-run"
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
  it("miltiple variables are added to the script", () => {
    const res = run(
      '--env "foo=bar, var=env " --template test/templates/pipeline-one-step.yml --dry-run'
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
});

it("working directory is overriden", () => {
  const res = run(
    "--template test/templates/pipeline-one-step.yml --work-dir /test_wd --dry-run"
  );
  expect(norm(res.stdout)).toMatchSnapshot();
  expect(res.stderr).toBe("");
  expect(res.code).toBe(0);
});

describe("parallel steps", () => {
  it("executes all steps when step name is not provided", () => {
    const res = run("--template test/templates/parallel-steps.yml --dry-run");
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });

  it("individual steps from a parallel section can be executed", () => {
    const res = run(
      "parallel_step_2 --template test/templates/parallel-steps.yml --work-dir /test_wd --dry-run"
    );
    expect(norm(res.stdout)).toMatchSnapshot();
    expect(res.stderr).toBe("");
    expect(res.code).toBe(0);
  });
});
