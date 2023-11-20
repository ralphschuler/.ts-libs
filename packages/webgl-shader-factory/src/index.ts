type ShaderType =
  | WebGLRenderingContext["VERTEX_SHADER"]
  | WebGLRenderingContext["FRAGMENT_SHADER"];

export class ShaderProgramFactory<
  U extends Record<string, WebGLUniformLocation>,
  A extends Record<string, number>,
> {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;

  constructor(
    gl: WebGLRenderingContext,
    vertexSrc: string,
    fragmentSrc: string,
  ) {
    this.gl = gl;
    this.program = this.initShaderProgram(vertexSrc, fragmentSrc);
  }

  private loadShader(type: ShaderType, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) return null;

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  private initShaderProgram(
    vertexSrc: string,
    fragmentSrc: string,
  ): WebGLProgram {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexSrc);
    const fragmentShader = this.loadShader(
      this.gl.FRAGMENT_SHADER,
      fragmentSrc,
    );

    if (!vertexShader || !fragmentShader) {
      throw new Error("Failed to load shaders");
    }

    const program = this.gl.createProgram();
    if (!program) throw new Error("Failed to create shader program");

    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error(this.gl.getProgramInfoLog(program));
      this.gl.deleteProgram(program);
      throw new Error("Failed to link shader program");
    }

    return program;
  }

  public getUniformLocations(uniformNames: (keyof U)[]): U {
    const uniforms: Partial<U> = {};

    for (const name of uniformNames) {
      const location = this.gl.getUniformLocation(this.program, name as string);
      if (location !== null) {
        (uniforms as any)[name] = location;
      }
    }

    return uniforms as U;
  }

  public getAttributeLocations(attributeNames: (keyof A)[]): A {
    const attributes: Partial<A> = {};

    for (const name of attributeNames) {
      const location = this.gl.getAttribLocation(this.program, name as string);
      if (location !== -1) {
        (attributes as any)[name] = location;
      }
    }

    return attributes as A;
  }

  public use() {
    this.gl.useProgram(this.program);
  }
}
