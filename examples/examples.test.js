function run(name, options = "") {
  const pwd = require("shelljs").pwd();
  const exec = require("shelljs").exec;
  const result = exec(
    `cd ${pwd}/examples/${name} && node ../../index.js ${options}`,
    {
      silent: true
    }
  );
  return result.stdout;
}

test("hello-world", () => {
  expect(run("hello-world")).toMatch("hello world!");
});

describe("multiple-pipelines", () => {
  test("all default steps", () => {
    expect(run("multiple-pipelines")).toBe(`executing step in "ubuntu"
default step
executing step in "ubuntu"
step2 executed
executing step in "ubuntu"
step3 executed in ubuntu
`);
  });

  test("step2", () => {
    expect(run("multiple-pipelines", "step2"))
      .toBe(`executing step "step2" in "ubuntu"
step2 executed
`);
  });
  test("Step Three", () => {
    expect(run("multiple-pipelines", '"Step Three"'))
      .toBe(`executing step "Step Three" in "ubuntu"
step3 executed in ubuntu
`);
  });

  test("master_step_2", () => {
    expect(
      run("multiple-pipelines", "master_step_2 --pipeline branches:master")
    ).toBe(`executing step "master_step_2" in "ubuntu"
step2 in master branch
`);
  });

  test("** -> 'branch step 2'", () => {
    expect(run("multiple-pipelines", '"branch step 2" --pipeline branches:**'))
      .toBe(`executing step "branch step 2" in "ubuntu"
step2 in any branch
`);
  });

  test("all master steps", () => {
    expect(run("multiple-pipelines", "--pipeline branches:master"))
      .toBe(`executing step in "ubuntu"
default step in master branch
executing step in "ubuntu"
step2 in master branch
`);
  });
});
