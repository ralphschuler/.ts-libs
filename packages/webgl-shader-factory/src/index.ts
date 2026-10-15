export class ShaderProgramFactory<
  U extends Record<string, WebGLUniformLocation>,
  A extends Record<string, number>,
> {
  private program: WebGLProgram;
  private disposed = false;
  constructor(
    private readonly gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string,
  ) {
    let vertex: WebGLShader | undefined;
    let fragment: WebGLShader | undefined;
    let program: WebGLProgram | null = null;
    try {
      vertex = this.compile(gl.VERTEX_SHADER, vertexSource);
      fragment = this.compile(gl.FRAGMENT_SHADER, fragmentSource);
      program = gl.createProgram();
      if (!program) throw new Error("Failed to create shader program");
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(
          gl.getProgramInfoLog(program) || "Failed to link shader program",
        );
      this.program = program;
    } catch (error) {
      if (program) gl.deleteProgram(program);
      throw error;
    } finally {
      if (vertex) gl.deleteShader(vertex);
      if (fragment) gl.deleteShader(fragment);
    }
  }
  private compile(type: number, source: string): WebGLShader {
    const shader = this.gl.createShader(type);
    if (!shader) throw new Error("Failed to allocate shader");
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      const message =
        this.gl.getShaderInfoLog(shader) || "Failed to compile shader";
      this.gl.deleteShader(shader);
      throw new Error(message);
    }
    return shader;
  }
  private assertAlive(): void {
    if (this.disposed || this.gl.isContextLost?.())
      throw new Error("Shader program is disposed or its context is lost");
  }
  getUniformLocations(names: (keyof U)[]): U {
    this.assertAlive();
    const values: Record<string, WebGLUniformLocation> = Object.create(null);
    for (const name of names) {
      const location = this.gl.getUniformLocation(this.program, String(name));
      if (location === null)
        throw new Error("Missing uniform: " + String(name));
      values[String(name)] = location;
    }
    return values as U;
  }
  getAttributeLocations(names: (keyof A)[]): A {
    this.assertAlive();
    const values: Record<string, number> = Object.create(null);
    for (const name of names) {
      const location = this.gl.getAttribLocation(this.program, String(name));
      if (location < 0) throw new Error("Missing attribute: " + String(name));
      values[String(name)] = location;
    }
    return values as A;
  }
  use(): void {
    this.assertAlive();
    this.gl.useProgram(this.program);
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.gl.deleteProgram(this.program);
  }
}
