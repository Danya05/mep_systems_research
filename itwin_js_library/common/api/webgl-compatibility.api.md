## API Report File for "@itwin/webgl-compatibility"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @internal
export class Capabilities {
    // (undocumented)
    static create(gl: WebGLContext, disabledExtensions?: WebGLExtensionName[]): Capabilities | undefined;
    // (undocumented)
    get driverBugs(): GraphicsDriverBugs;
    init(gl: WebGLContext, disabledExtensions?: WebGLExtensionName[]): WebGLRenderCompatibilityInfo;
    // (undocumented)
    get isMobile(): boolean;
    // (undocumented)
    get isWebGL2(): boolean;
    // (undocumented)
    get maxAntialiasSamples(): number;
    // (undocumented)
    get maxColorAttachments(): number;
    // (undocumented)
    get maxDepthType(): DepthType;
    // (undocumented)
    get maxDrawBuffers(): number;
    // (undocumented)
    get maxFragTextureUnits(): number;
    // (undocumented)
    get maxFragUniformVectors(): number;
    // (undocumented)
    get maxRenderType(): RenderType;
    // (undocumented)
    get maxTexSizeAllow(): number;
    // (undocumented)
    get maxTextureSize(): number;
    // (undocumented)
    get maxVaryingVectors(): number;
    // (undocumented)
    get maxVertAttribs(): number;
    // (undocumented)
    get maxVertTextureUnits(): number;
    // (undocumented)
    get maxVertUniformVectors(): number;
    // (undocumented)
    static readonly optionalFeatures: WebGLFeature[];
    queryExtensionObject<T>(ext: WebGLExtensionName): T | undefined;
    // (undocumented)
    static readonly requiredFeatures: WebGLFeature[];
    // (undocumented)
    setMaxAnisotropy(desiredMax: number | undefined, gl: WebGLContext): void;
    // (undocumented)
    get supports32BitElementIndex(): boolean;
    // (undocumented)
    get supportsAntiAliasing(): boolean;
    // (undocumented)
    get supportsCreateImageBitmap(): boolean;
    // (undocumented)
    get supportsDisjointTimerQuery(): boolean;
    // (undocumented)
    get supportsDrawBuffers(): boolean;
    // (undocumented)
    get supportsFragDepth(): boolean;
    // (undocumented)
    get supportsInstancing(): boolean;
    // (undocumented)
    get supportsMRTPickShaders(): boolean;
    // (undocumented)
    get supportsMRTTransparency(): boolean;
    get supportsNonPowerOf2Textures(): boolean;
    // (undocumented)
    get supportsShaderTextureLOD(): boolean;
    // (undocumented)
    get supportsShadowMaps(): boolean;
    // (undocumented)
    get supportsStandardDerivatives(): boolean;
    // (undocumented)
    get supportsTextureFilterAnisotropic(): boolean;
    // (undocumented)
    get supportsTextureFloat(): boolean;
    // (undocumented)
    get supportsTextureFloatLinear(): boolean;
    // (undocumented)
    get supportsTextureHalfFloat(): boolean;
    // (undocumented)
    get supportsTextureHalfFloatLinear(): boolean;
    // (undocumented)
    get supportsVertexArrayObjects(): boolean;
}

// @public
export type ContextCreator = (canvas: HTMLCanvasElement, useWebGL2: boolean, inputContextAttributes?: WebGLContextAttributes) => WebGLContext | undefined;

// @internal
export enum DepthType {
    // (undocumented)
    RenderBufferUnsignedShort16 = 0,// core to WebGL1
    // (undocumented)
    TextureUnsignedInt24Stencil8 = 1,// core to WebGL2; available to WebGL1 via WEBGL_depth_texture
    // (undocumented)
    TextureUnsignedInt32 = 2
}

// @public
export interface GraphicsDriverBugs {
    fragDepthDoesNotDisableEarlyZ?: true;
    msaaWillHang?: true;
}

// @public
export function queryRenderCompatibility(useWebGL2: boolean, createContext?: ContextCreator): WebGLRenderCompatibilityInfo;

// @internal
export enum RenderType {
    // (undocumented)
    TextureFloat = 2,
    // (undocumented)
    TextureHalfFloat = 1,
    // (undocumented)
    TextureUnsignedByte = 0
}

// @public
export type WebGLContext = WebGLRenderingContext | WebGL2RenderingContext;

// @internal (undocumented)
export type WebGLExtensionName = "WEBGL_draw_buffers" | "OES_element_index_uint" | "OES_texture_float" | "OES_texture_float_linear" | "OES_texture_half_float" | "OES_texture_half_float_linear" | "EXT_texture_filter_anisotropic" | "WEBGL_depth_texture" | "EXT_color_buffer_float" | "EXT_shader_texture_lod" | "ANGLE_instanced_arrays" | "OES_vertex_array_object" | "WEBGL_lose_context" | "EXT_frag_depth" | "EXT_disjoint_timer_query" | "EXT_disjoint_timer_query_webgl2" | "OES_standard_derivatives" | "EXT_float_blend";

// @public
export enum WebGLFeature {
    AntiAliasing = "anti-aliasing",
    DepthTexture = "depth texture",
    FloatRendering = "float rendering",
    FragDepth = "fragment depth",
    Instancing = "instancing",
    MinimalTextureUnits = "minimal texture units",
    MrtPick = "mrt pick",
    MrtTransparency = "mrt transparency",
    ShadowMaps = "shadow maps",
    StandardDerivatives = "standard derivatives",
    UintElementIndex = "uint element index"
}

// @public
export interface WebGLRenderCompatibilityInfo {
    contextErrorMessage?: string;
    createdContext?: WebGLContext;
    driverBugs: GraphicsDriverBugs;
    missingOptionalFeatures: WebGLFeature[];
    missingRequiredFeatures: WebGLFeature[];
    status: WebGLRenderCompatibilityStatus;
    unmaskedRenderer?: string;
    unmaskedVendor?: string;
    userAgent: string;
    usingIntegratedGraphics?: boolean;
}

// @public
export enum WebGLRenderCompatibilityStatus {
    AllOkay = 0,
    CannotCreateContext = 4,
    MajorPerformanceCaveat = 2,
    MissingOptionalFeatures = 1,
    MissingRequiredFeatures = 3
}

// (No @packageDocumentation comment for this package)

```