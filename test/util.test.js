const {extractPipelineName} = require("../src/util");
const {parseVars} = require("../src/util");

describe("extractPipelineName", () => {
  it("general case", () => {
    expect(extractPipelineName("foo:bar")).toMatchObject({
      pipeline: "foo",
      pipelineName: "bar"
    });
  });

  it("no pipeline name", () => {
    expect(extractPipelineName("foo")).toMatchObject({
      pipeline: "foo",
      pipelineName: ""
    });
  });

  it("multiple colons", () => {
    expect(extractPipelineName("foo:bar:bar")).toMatchObject({
      pipeline: "foo",
      pipelineName: "bar:bar"
    });
  });
});
describe("parseVars function", () => {
  it("should be one simple variable", () => {
    expect(parseVars("ONE=one")).toMatchObject([
      "ONE=one"
    ]);
  });
  it("should be two simple variable", () => {
    expect(parseVars("ONE=one,TWO=two")).toMatchObject([
      "ONE=one",
      "TWO=two"
    ]);
  });
  it("should be two simple variable (Trim space)", () => {
    expect(parseVars("ONE=one, TWO=two")).toMatchObject([
      "ONE=one",
      "TWO=two"
    ]);
  });
  it("should be simple json", () => {
    expect(parseVars("ONE='{}'")).toMatchObject([
      "ONE='{}'",
    ]);
  });
  it("should be three simple json", () => {
    expect(parseVars("ONE='{}',TWO='{}',THREE='{}'")).toMatchObject([
      "ONE='{}'",
      "TWO='{}'",
      "THREE='{}'",
    ]);
  });
  it("should be three simple json (Simple quote)", () => {
    expect(parseVars("ONE='{}'")).toMatchObject([
      "ONE='{}'",
    ]);
  });
  it("should be three simple json with attribute", () => {
    expect(parseVars("ONE='{attr: \"value\"}'")).toMatchObject([
      "ONE='{attr: \"value\"}'",
    ]);
  });
  it("should be complex json with multiple attributes", () => {
    expect(parseVars("ONE='{attr1: \"value\", attr2:\"value attr 2\"}'")).toMatchObject([
      "ONE='{attr1: \"value\", attr2:\"value attr 2\"}'",
    ]);
  });

  it("should be one json and one simple var", () => {
    expect(parseVars("ONE='{}', TWO=two")).toMatchObject([
      "ONE='{}'",
      "TWO=two",
    ]);
  });
  it("should be one json and two simple vars", () => {
    expect(parseVars("ONE='{}', TWO=two, THREE=three")).toMatchObject([
      "ONE='{}'",
      "TWO=two",
      "THREE=three",
    ]);
  });
  it("should trim the spaces", () => {
    expect(parseVars("ONE='{}' , TWO=two , THREE=three ")).toMatchObject([
      "ONE='{}'",
      "TWO=two",
      "THREE=three",
    ]);
  });
});
