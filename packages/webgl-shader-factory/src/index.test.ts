import assert from "node:assert/strict";
import { it } from "node:test";
import { ShaderProgramFactory } from "./index.js";
const context = (fail: "compile" | "link" | null = null) => {
  const deletedShaders: unknown[] = [];
  const deletedPrograms: unknown[] = [];
  const gl = {
    VERTEX_SHADER: 1,
    FRAGMENT_SHADER: 2,
    COMPILE_STATUS: 3,
    LINK_STATUS: 4,
    createShader: () => ({}),
    shaderSource() {},
    compileShader() {},
    getShaderParameter: () => fail !== "compile",
    getShaderInfoLog: () => "compile failed",
    deleteShader: (shader: unknown) => deletedShaders.push(shader),
    createProgram: () => ({}),
    attachShader() {},
    linkProgram() {},
    getProgramParameter: () => fail !== "link",
    getProgramInfoLog: () => "link failed",
    deleteProgram: (program: unknown) => deletedPrograms.push(program),
    getUniformLocation: () => null,
    getAttribLocation: () => -1,
    useProgram() {},
    isContextLost: () => false,
  } as unknown as WebGLRenderingContext;
  return { gl, deletedShaders, deletedPrograms };
};
it("cleans up shaders and programs on failure and idempotent disposal", () => {
  for (const mode of ["compile", "link"] as const) {
    const mock = context(mode);
    assert.throws(
      () => new ShaderProgramFactory(mock.gl, "vertex", "fragment"),
      /failed/,
    );
    assert.equal(mock.deletedShaders.length, mode === "compile" ? 1 : 2);
    assert.equal(mock.deletedPrograms.length, mode === "compile" ? 0 : 1);
  }
  const mock = context();
  const program = new ShaderProgramFactory(mock.gl, "vertex", "fragment");
  assert.throws(
    () => program.getUniformLocations(["missing"]),
    /Missing uniform/,
  );
  program.dispose();
  program.dispose();
  assert.equal(mock.deletedPrograms.length, 1);
  assert.throws(() => program.use(), /disposed/);
});
