function run(options) {
  const exec = require("shelljs").exec;
  return exec(`node index.js ${options}`, {
    silent: true
  });
}

describe("should fail properly when script section is mispelled", () => {
  it("running all steps in a pipeline", () => {
    const result = run(
      "--template test/templates/mispelled-scripts.yml --pipeline branches:master --dry-run"
    );
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatchSnapshot();
    expect(result.code).toBe(1);
  });

  it("running a step by name", () => {
    const result = run(
      "run_dev --template test/templates/mispelled-scripts.yml --pipeline branches:dev --dry-run"
    );
    expect(result.stdout).toBe("");
    expect(result.stderr).toMatchSnapshot();
    expect(result.code).toBe(1);
  });
});

it("non-existing template should fail", () => {
  const res = run("--template foo.yml --dry-run");
  expect(res.stdout).toBe("");
  expect(res.stderr).toBe("foo.yml can't be found\n");
  expect(res.code).toBe(1);
});

it("invalid yaml should fail", () => {
  const res = run("--template test/templates/empty-template.yml --dry-run");
  expect(res.stdout).toBe("");
  expect(res.stderr).toMatchSnapshot();
  expect(res.code).toBe(1);
});

it("empty template file should fail", () => {
  const res = run("--template test/templates/empty-template.yml --dry-run");
  expect(res.stdout).toBe("");
  expect(res.stderr).toMatchSnapshot();
  expect(res.code).toBe(1);
});
