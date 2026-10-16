import assert from "node:assert/strict";
import { ShaderProgramFactory } from "../src/index.js";
// A mock keeps this lifecycle example executable without a browser or GPU.
let deleted = 0;
const gl = {
  VERTEX_SHADER: 1,
  FRAGMENT_SHADER: 2,
  COMPILE_STATUS: 3,
  LINK_STATUS: 4,
  createShader: () => ({}),
  shaderSource() {},
  compileShader() {},
  getShaderParameter: () => true,
  deleteShader() {},
  createProgram: () => ({}),
  attachShader() {},
  linkProgram() {},
  getProgramParameter: () => true,
  deleteProgram() {
    deleted++;
  },
  useProgram() {},
  isContextLost: () => false,
} as unknown as WebGLRenderingContext;
const program = new ShaderProgramFactory(gl, "vertex", "fragment");
program.use();
program.dispose();
assert.equal(deleted, 1);
