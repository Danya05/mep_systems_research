## API Report File for "@itwin/ecschema-locaters"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { ISchemaLocater } from '@itwin/ecschema-metadata';
import { Schema } from '@itwin/ecschema-metadata';
import { SchemaContext } from '@itwin/ecschema-metadata';
import { SchemaInfo } from '@itwin/ecschema-metadata';
import { SchemaKey } from '@itwin/ecschema-metadata';
import { SchemaMatchType } from '@itwin/ecschema-metadata';

// @beta
export class FileSchemaKey extends SchemaKey {
    constructor(key: SchemaKey, fileName: string, schemaJson?: string);
    // (undocumented)
    fileName: string;
    // (undocumented)
    schemaText?: string;
}

// @beta
export abstract class SchemaFileLocater {
    constructor();
    addSchemaSearchPath(schemaPath: string): void;
    addSchemaSearchPaths(schemaPaths: string[]): void;
    compareSchemaKeyByVersion: (lhs: FileSchemaKey, rhs: FileSchemaKey) => number;
    // (undocumented)
    fileExists(filePath: string): Promise<boolean | undefined>;
    // (undocumented)
    fileExistsSync(filePath: string): boolean | undefined;
    protected findEligibleSchemaKeys(desiredKey: Readonly<SchemaKey>, matchType: SchemaMatchType, format: string): FileSchemaKey[];
    // (undocumented)
    abstract getSchema<T extends Schema>(key: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<T | undefined>;
    // (undocumented)
    protected abstract getSchemaKey(data: string): SchemaKey;
    // (undocumented)
    readUtf8FileToString(filePath: string): Promise<string | undefined>;
    // (undocumented)
    readUtf8FileToStringSync(filePath: string): string | undefined;
    // (undocumented)
    searchPaths: string[];
}

// @beta
export class SchemaJsonFileLocater extends SchemaFileLocater implements ISchemaLocater {
    getSchema<T extends Schema>(schemaKey: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<T | undefined>;
    getSchemaInfo(schemaKey: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<SchemaInfo | undefined>;
    protected getSchemaKey(data: string): SchemaKey;
    getSchemaSync<T extends Schema>(schemaKey: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): T | undefined;
}

// @beta
export namespace SchemaXml {
    export function writeFile(schema: Schema, outputPath: string): Promise<void>;
    export function writeString(schema: Schema): Promise<string>;
}

// @beta
export class SchemaXmlFileLocater extends SchemaFileLocater implements ISchemaLocater {
    getSchema<T extends Schema>(key: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<T | undefined>;
    getSchemaInfo(schemaKey: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<SchemaInfo | undefined>;
    getSchemaKey(data: string): SchemaKey;
    getSchemaSync<T extends Schema>(key: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): T | undefined;
}

// @beta
export class SchemaXmlStringLocater extends SchemaStringLocater implements ISchemaLocater {
    getSchema<T extends Schema>(schemaKey: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<T | undefined>;
    getSchemaInfo(schemaKey: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<SchemaInfo | undefined>;
    getSchemaKey(schemaXml: string): SchemaKey;
    getSchemaSync<T extends Schema>(schemaKey: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): T | undefined;
}

// @internal
export class StubSchemaXmlFileLocater extends SchemaFileLocater implements ISchemaLocater {
    getSchema<T extends Schema>(key: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<T | undefined>;
    getSchemaInfo(key: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): Promise<SchemaInfo | undefined>;
    getSchemaKey(schemaXml: string): SchemaKey;
    getSchemaSync<T extends Schema>(key: SchemaKey, matchType: SchemaMatchType, context: SchemaContext): T | undefined;
    loadSchema(schemaPath: string, schemaText?: string): Schema;
}

// (No @packageDocumentation comment for this package)

```