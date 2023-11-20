// Define basic types for color
interface Color extends ISerializable<Color> {
  r: number;
  g: number;
  b: number;
  a: number;
}

// Extended Pixel Matrix Interface
interface IPixelMatrix {
  width: number;
  height: number;
  data: Uint8Array; // Storing the pixel matrix as an UInt8Array
  getColor(x: number, y: number): Color;
  setColor(x: number, y: number, color: Color): void;
  indexToCoordinates(index: number): { x: number; y: number };
  coordinatesToIndex(x: number, y: number): number;
}

// Extended Shader Program Interface
interface IShaderProgram {
  vertexShader: string;
  fragmentShader: string;
  link(): boolean;
  use(): void;
  setUniform(name: string, value: any): void;
  setAttribute(name: string, value: any): void;
}

// Shader Implementation
class ShaderProgram implements IShaderProgram {
  vertexShader: string;
  fragmentShader: string;
  private gl: WebGLRenderingContext;
  private program: WebGLProgram | null;

  constructor(
    gl: WebGLRenderingContext,
    vertexShader: string,
    fragmentShader: string,
  ) {
    this.gl = gl;
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
    this.program = null;
  }

  link(): boolean {
    const vertexShader = this.compileShader(
      this.gl.VERTEX_SHADER,
      this.vertexShader,
    );
    const fragmentShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      this.fragmentShader,
    );

    if (!vertexShader || !fragmentShader) {
      return false;
    }

    this.program = this.gl.createProgram();
    if (!this.program) {
      return false;
    }

    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);

    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error(
        "Could not link shader program:",
        this.gl.getProgramInfoLog(this.program),
      );
      return false;
    }

    return true;
  }

  use(): void {
    if (this.program) {
      this.gl.useProgram(this.program);
    }
  }

  setUniform(name: string, value: any): void {
    // Implement uniform setting logic
  }

  setAttribute(name: string, value: any): void {
    // Implement attribute setting logic
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    const shader = this.gl.createShader(type);
    if (!shader) {
      return null;
    }

    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        "Could not compile shader:",
        this.gl.getShaderInfoLog(shader),
      );
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}

// Interface for Renderer
interface IPixelMatrixRenderer {
  init(pixelMatrix: IPixelMatrix, shaderProgram: IShaderProgram): boolean;
  render(): void;
  updatePixelMatrix(pixelMatrix: IPixelMatrix): void;
}

// Extended WebGLContext Interface
interface IWebGLContext {
  getContext(): WebGLRenderingContext | null;
  resize(width: number, height: number): void;
  enableFeature(feature: string): void;
  disableFeature(feature: string): void;
}

interface ISerializable<Type> {
  serialize(): Type;
  deserialize(data: Type): void;
}
