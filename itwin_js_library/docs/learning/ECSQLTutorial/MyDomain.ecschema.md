---
noEditThisPage: true
Schema: MyDomain
Note: This file was automatically generated via ecjson2md. Do not edit this file. Any edits made to this file will be overwritten the next time it is generated
---

# MyDomain ECSchema

**alias:** mydomain

**version:** 1.0.0

## Entity Classes

### Building

**typeName:** EntityClass

**modifier:** Sealed

**baseClass:** [BisCore:SpatialLocationElement](biscore.ecschema.md#spatiallocationelement)

### Device

**typeName:** EntityClass

**modifier:** Sealed

**baseClass:** [BisCore:PhysicalElement](biscore.ecschema.md#physicalelement)

### DeviceType

**typeName:** EntityClass

**displayLabel:** Device Type

**modifier:** Abstract

**baseClass:** [BisCore:PhysicalType](biscore.ecschema.md#physicaltype)

#### Properties

| Name             | Description | Type   | Extended Type |
| :--------------- | :---------- | :----- | :------------ |
| ManufacturerName |             | string |               |

### FlameDetectorType

**typeName:** EntityClass

**displayLabel:** Flame Detector Type

**modifier:** Sealed

**baseClass:** [MyDomain:DeviceType](#devicetype)

#### Properties

| Name                    | Description | Type                    | Extended Type |
| :---------------------- | :---------- | :---------------------- | :------------ |
| FlameDetectionTechnique |             | FlameDetectionTechnique |               |

### NoteMultiAspect

**typeName:** EntityClass

**displayLabel:** Note

**modifier:** Sealed

**baseClass:** [BisCore:ElementMultiAspect](biscore.ecschema.md#elementmultiaspect)

#### Properties

| Name | Description | Type   | Extended Type |
| :--- | :---------- | :----- | :------------ |
| Note |             | string |               |

### SmokeDetectorType

**typeName:** EntityClass

**displayLabel:** Smoke Detector Type

**modifier:** Sealed

**baseClass:** [MyDomain:DeviceType](#devicetype)

#### Properties

| Name                    | Description | Type                    | Extended Type |
| :---------------------- | :---------- | :---------------------- | :------------ |
| SmokeDetectionTechnique |             | SmokeDetectionTechnique |               |

### Space

**typeName:** EntityClass

**modifier:** Sealed

**baseClass:** [BisCore:SpatialLocationElement](biscore.ecschema.md#spatiallocationelement)

### Story

**typeName:** EntityClass

**modifier:** Sealed

**baseClass:** [BisCore:SpatialLocationElement](biscore.ecschema.md#spatiallocationelement)

### SyncInfoAspect

**typeName:** EntityClass

**displayLabel:** Provenance

**modifier:** Sealed

**baseClass:** [BisCore:ElementUniqueAspect](biscore.ecschema.md#elementuniqueaspect)

#### Properties

| Name     | Description | Type   | Extended Type |
| :------- | :---------- | :----- | :------------ |
| SyncId   |             | string |               |
| Checksum |             | string |               |

## Relationship Classes

### StoryHasGeneratedDrawing

**typeName:** RelationshipClass

Tracks the relationship between a Story and a Drawing generated from that Story.

**modifier:** None

**baseClass:** [BisCore:ElementRefersToElements](biscore.ecschema.md#elementreferstoelements)

**Strength:** Referencing

**strengthDirection:** Forward

#### Source

**isPolymorphic:** true

**roleLabel:** has generated

**multiplicity:** (0..1)

##### Constraint Classes

- [Story](#story)

#### Target

**isPolymorphic:** true

**roleLabel:** is generated from

**multiplicity:** (0..1)

##### Constraint Classes

- [Drawing](biscore.ecschema.md#drawing)

## Enumerations

### FlameDetectionTechnique

**typeName:** Enumeration

**Backing Type:** int

**Strict:** true

| Label | Value |
| :---- | :---- |
|       | 0     |
|       | 1     |
|       | 2     |

### SmokeDetectionTechnique

**typeName:** Enumeration

**Backing Type:** int

**Strict:** true

| Label | Value |
| :---- | :---- |
|       | 0     |
|       | 1     |
|       | 2     |