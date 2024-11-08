/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
const globalSymbol = Symbol.for("itwin.core.frontend.globals");
const ext = globalThis[globalSymbol].getExtensionApi(import.meta.url);

// exception for ExtensionHost
export const { ExtensionHost } = ext.exports;

// BEGIN GENERATED CODE
export const {
// @itwin/core-frontend:
	ACSDisplayOptions,
	ACSType,
	AccuDrawHintBuilder,
	AccuSnap,
	ActivityMessageDetails,
	ActivityMessageEndReason,
	AuxCoordSystem2dState,
	AuxCoordSystem3dState,
	AuxCoordSystemSpatialState,
	AuxCoordSystemState,
	BeButton,
	BeButtonEvent,
	BeButtonState,
	BeModifierKeys,
	BeTouchEvent,
	BeWheelEvent,
	BingElevationProvider,
	BingLocationProvider,
	CategorySelectorState,
	ChangeFlags,
	ClipEventType,
	Cluster,
	ContextRealityModelState,
	ContextRotationId,
	CoordSource,
	CoordSystem,
	CoordinateLockOverrides,
	DecorateContext,
	Decorations,
	DisclosedTileTreeSet,
	DisplayStyle2dState,
	DisplayStyle3dState,
	DisplayStyleState,
	DrawingModelState,
	DrawingViewState,
	EditManipulator,
	ElementLocateManager,
	ElementPicker,
	ElementState,
	EmphasizeElements,
	EntityState,
	EventController,
	EventHandled,
	FeatureSymbology,
	FlashMode,
	FlashSettings,
	FrontendLoggerCategory,
	FrustumAnimator,
	GeometricModel2dState,
	GeometricModel3dState,
	GeometricModelState,
	GlobeAnimator,
	GraphicAssembler,
	GraphicBranch,
	GraphicBuilder,
	GraphicType,
	HiliteSet,
	HitDetail,
	HitDetailType,
	HitGeomType,
	HitList,
	HitParentGeomType,
	HitPriority,
	HitSource,
	IModelConnection,
	IconSprites,
	InputCollector,
	InputSource,
	InteractiveTool,
	IntersectDetail,
	KeyinParseError,
	LocateAction,
	LocateFilterStatus,
	LocateOptions,
	LocateResponse,
	ManipulatorToolEvent,
	MarginPercent,
	Marker,
	MarkerSet,
	MessageBoxIconType,
	MessageBoxType,
	MessageBoxValue,
	ModelSelectorState,
	ModelState,
	NotificationHandler,
	NotificationManager,
	NotifyMessageDetails,
	OffScreenViewport,
	OrthographicViewState,
	OutputMessageAlert,
	OutputMessagePriority,
	OutputMessageType,
	ParseAndRunResult,
	ParticleCollectionBuilder,
	PerModelCategoryVisibility,
	PhysicalModelState,
	Pixel,
	PrimitiveTool,
	RenderClipVolume,
	RenderContext,
	RenderGraphic,
	RenderGraphicOwner,
	RenderSystem,
	Scene,
	ScreenViewport,
	SectionDrawingModelState,
	SelectionMethod,
	SelectionMode,
	SelectionProcessing,
	SelectionSet,
	SelectionSetEventType,
	SheetModelState,
	SheetViewState,
	SnapDetail,
	SnapHeat,
	SnapMode,
	SnapStatus,
	SpatialLocationModelState,
	SpatialModelState,
	SpatialViewState,
	Sprite,
	SpriteLocation,
	StandardViewId,
	StartOrResume,
	TentativePoint,
	Tile,
	TileAdmin,
	TileBoundingBoxes,
	TileDrawArgs,
	TileGraphicType,
	TileLoadPriority,
	TileLoadStatus,
	TileRequest,
	TileRequestChannel,
	TileRequestChannelStatistics,
	TileRequestChannels,
	TileTree,
	TileTreeLoadStatus,
	TileTreeReference,
	TileUsageMarker,
	TileVisibility,
	Tiles,
	Tool,
	ToolAdmin,
	ToolAssistance,
	ToolAssistanceImage,
	ToolAssistanceInputMethod,
	ToolSettings,
	TwoWayViewportFrustumSync,
	TwoWayViewportSync,
	UniformType,
	VaryingType,
	ViewClipClearTool,
	ViewClipDecoration,
	ViewClipDecorationProvider,
	ViewClipTool,
	ViewCreator2d,
	ViewCreator3d,
	ViewManager,
	ViewManip,
	ViewPose,
	ViewPose2d,
	ViewPose3d,
	ViewRect,
	ViewState,
	ViewState2d,
	ViewState3d,
	ViewStatus,
	ViewTool,
	ViewingSpace,
	Viewport,
	canvasToImageBuffer,
	canvasToResizedCanvasWithBars,
	connectViewportFrusta,
	connectViewportViews,
	connectViewports,
	extractImageSourceDimensions,
	getCompressedJpegFromCanvas,
	getImageSourceFormatForMimeType,
	getImageSourceMimeType,
	imageBufferToBase64EncodedPng,
	imageBufferToCanvas,
	imageBufferToPngDataUrl,
	imageElementFromImageSource,
	imageElementFromUrl,
	queryTerrainElevationOffset,
	readElementGraphics,
	readGltfGraphics,
	synchronizeViewportFrusta,
	synchronizeViewportViews,
// @itwin/core-common:
	BackgroundFill,
	BackgroundMapType,
	BatchType,
	BisCodeSpec,
	BriefcaseIdValue,
	ChangeOpCode,
	ChangedValueState,
	ChangesetType,
	ClipIntersectionStyle,
	ColorByName,
	ColorDef,
	CommonLoggerCategory,
	ECSqlSystemProperty,
	ECSqlValueType,
	ElementGeometryOpcode,
	FeatureOverrideType,
	FillDisplay,
	FillFlags,
	FontType,
	FrustumPlanes,
	GeoCoordStatus,
	GeometryClass,
	GeometryStreamFlags,
	GeometrySummaryVerbosity,
	GlobeMode,
	GridOrientationType,
	HSVConstants,
	ImageBufferFormat,
	ImageSourceFormat,
	LinePixels,
	MassPropertiesOperation,
	MonochromeMode,
	Npc,
	PlanarClipMaskMode,
	PlanarClipMaskPriority,
	QParams2d,
	QParams3d,
	QPoint2d,
	QPoint2dBuffer,
	QPoint2dBufferBuilder,
	QPoint2dList,
	QPoint3d,
	QPoint3dBuffer,
	QPoint3dBufferBuilder,
	QPoint3dList,
	Quantization,
	QueryRowFormat,
	Rank,
	RenderMode,
	SectionType,
	SkyBoxImageType,
	SpatialClassifierInsideDisplay,
	SpatialClassifierOutsideDisplay,
	SyncMode,
	TerrainHeightOriginMode,
	TextureMapUnits,
	ThematicDisplayMode,
	ThematicGradientColorScheme,
	ThematicGradientMode,
	ThematicGradientTransparencyMode,
	TxnAction,
	TypeOfChange,
} = ext.exports;
// END GENERATED CODE