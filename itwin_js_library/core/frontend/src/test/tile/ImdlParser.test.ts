/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { RenderSchedule as RS, TileReadStatus } from "@itwin/core-common";
import { ImdlTimeline } from "../../common/imdl/ParseImdlDocument";
import { acquireImdlParser, ImdlParser } from "../../tile/internal";
import { IModelApp } from "../../IModelApp";

describe("acquireImdlParser", () => {
  beforeAll(async () => {
    await IModelApp.startup({ publicPath: "/" });
  });
  afterAll(async () => IModelApp.shutdown());

  const model1Props: RS.ModelTimelineProps = { modelId: "0x1", elementTimelines: [] };
  const model2Props: RS.ModelTimelineProps = { modelId: "0x2", elementTimelines: [] };
  const script1Props: RS.ScriptProps = [{ ...model1Props }];
  const script2Props: RS.ScriptProps = [{ ...model2Props }];

  it("returns the same parser every time if no timeline, even after the parser is released", () => {
    const parser = acquireImdlParser({});
    expect(acquireImdlParser({})).toEqual(parser);

    parser.release();
    expect(acquireImdlParser({})).toEqual(parser);
  });

  function acquire(timeline: ImdlTimeline) {
    return acquireImdlParser({ timeline });
  }

  it("returns the same parser for equivalent timelines", () => {
    const model = RS.ModelTimeline.fromJSON(model1Props);

    const modelParser = acquire(model);
    expect(acquire(model)).toEqual(modelParser);
    expect(acquire(RS.ModelTimeline.fromJSON(model1Props))).toEqual(modelParser);

    const script = RS.Script.fromJSON(script2Props)!;
    const scriptParser = acquire(script);
    expect(acquire(script)).toEqual(scriptParser);
    expect(acquire(RS.Script.fromJSON(script2Props)!)).toEqual(scriptParser);

    modelParser.release();
    modelParser.release();
    modelParser.release();
    scriptParser.release();
    scriptParser.release();
    scriptParser.release();
  });

  it("returns different parsers for different timelines", () => {
    const m1 = acquire(RS.ModelTimeline.fromJSON(model1Props));
    const m2 = acquire(RS.ModelTimeline.fromJSON(model2Props));
    expect(m1).not.toEqual(m2);

    const s1 = acquire(RS.Script.fromJSON(script1Props)!);
    const s2 = acquire(RS.Script.fromJSON(script2Props)!);
    expect(s1).not.toEqual(s2);

    m1.release();
    m2.release();
    s1.release();
    s2.release();
  });

  it("returns a new parser for the same timeline after original parser is released", () => {
    const m = RS.ModelTimeline.fromJSON(model1Props);
    const mp1 = acquire(m); // ref-count = 1
    const mp2 = acquire(m); // ref-count = 2
    expect(mp1).toEqual(mp2);

    mp1.release(); // ref-count = 1
    const mp3 = acquire(m); // ref-count = 2
    expect(mp3).toEqual(mp1);

    mp1.release(); // ref-count = 1
    mp1.release(); // ref-count = 0
    const mp4 = acquire(m);
    expect(mp4).not.toEqual(mp1);
    expect(acquire(m)).toEqual(mp4);

    mp4.release();
    mp4.release();

    const s = RS.Script.fromJSON(script1Props)!;
    const sp1 = acquire(s); // ref-count = 1
    const sp2 = acquire(s); // ref-count = 2
    expect(sp1).toEqual(sp2);

    sp1.release(); // ref-count = 1
    const sp3 = acquire(s); // ref-count = 2
    expect(sp3).toEqual(sp1);

    sp1.release(); // ref-count = 1
    sp1.release(); // ref-count = 0
    const sp4 = acquire(s);
    expect(sp4).not.toEqual(sp1);
    expect(acquire(s)).toEqual(sp4);

    sp4.release();
    sp4.release();
  });

  it("returns a different parser each time if not using web worker", () => {
    const parsers = new Set<ImdlParser>();
    const getParser = (timeline?: ImdlTimeline) => {
      const parser = acquireImdlParser({ noWorker: true, timeline });
      expect(parsers.has(parser)).toBe(false);
      parsers.add(parser);
    };

    getParser();
    getParser();
    const model = RS.ModelTimeline.fromJSON(model1Props);
    getParser(model);
    getParser(model);
    const script = RS.Script.fromJSON(script2Props);
    getParser(script);
    getParser(script);
  });
});

describe("ImdlParser", () => {
  beforeAll(async () => {
    await IModelApp.startup({ publicPath: "/" });
  });
  afterAll(async () => IModelApp.shutdown());

  it("produces an error upon invalid tile header", async () => {
    const parser = acquireImdlParser({});
    const document = await parser.parse({
      data: new Uint8Array(512),
      batchModelId: "0x123",
      is3d: true,
      maxVertexTableSize: 4096,
    });

    expect(document).toEqual(TileReadStatus.InvalidHeader);
  });

  it("produces an error when reading outside tile data", async () => {
    const parser = acquireImdlParser({});
    await expect(
      parser.parse({
        data: new Uint8Array(12),
        batchModelId: "0x123",
        is3d: true,
        maxVertexTableSize: 4096,
      }),
    ).rejects.toThrow(RangeError);
  });

  it("transfers the array buffer to the worker", async () => {
    const parser = acquireImdlParser({});
    const data = new Uint8Array(12);
    expect(data.length).toEqual(12);
    await expect(
      parser.parse({
        data,
        batchModelId: "0x123",
        is3d: true,
        maxVertexTableSize: 4096,
      }),
    ).rejects.toThrow(RangeError);
    expect(data.length).toEqual(0);
  });

  it("successfully parses the document", async () => {
    const tileData = new Uint8Array([
      0x69, 0x4d, 0x64, 0x6c, 0x00, 0x00, 0x02, 0x00, 0x58, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc7, 0x4b, 0x37, 0x89,
      0x41, 0x00, 0x04, 0xc0, 0xc7, 0x4b, 0x37, 0x89, 0x41, 0x00, 0x14, 0xc0, 0x00, 0x00, 0xbd, 0x9a, 0xf2, 0xd7, 0x5a, 0xbe,
      0x39, 0xb4, 0xc8, 0x76, 0xbe, 0xff, 0x03, 0x40, 0x39, 0xb4, 0xc8, 0x76, 0xbe, 0xff, 0x13, 0x40, 0x00, 0x00, 0xbd, 0x9a,
      0xf2, 0xd7, 0x5a, 0xbe, 0x83, 0x68, 0x7c, 0x54, 0x31, 0x5d, 0x86, 0x3f, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x58, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x20, 0x00, 0x01, 0x00, 0x00, 0x00,
      0x4e, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x67, 0x6c, 0x54, 0x46, 0x01, 0x00, 0x00, 0x00, 0xe0, 0x06, 0x00, 0x00, 0xd0, 0x05, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56, 0x69, 0x65, 0x77, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x62, 0x76, 0x56,
      0x65, 0x72, 0x74, 0x65, 0x78, 0x30, 0x22, 0x3a, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x22, 0x62,
      0x69, 0x6e, 0x61, 0x72, 0x79, 0x5f, 0x67, 0x6c, 0x54, 0x46, 0x22, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e,
      0x67, 0x74, 0x68, 0x22, 0x3a, 0x36, 0x34, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22,
      0x3a, 0x30, 0x7d, 0x2c, 0x22, 0x62, 0x76, 0x65, 0x6e, 0x64, 0x50, 0x6f, 0x69, 0x6e, 0x74, 0x41, 0x6e, 0x64, 0x51, 0x75,
      0x61, 0x64, 0x49, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x30, 0x53, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x22, 0x3a,
      0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x22, 0x62, 0x69, 0x6e, 0x61, 0x72, 0x79, 0x5f, 0x67, 0x6c,
      0x54, 0x46, 0x22, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22, 0x3a, 0x39, 0x36, 0x2c,
      0x22, 0x62, 0x79, 0x74, 0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x31, 0x35, 0x36, 0x7d, 0x2c, 0x22, 0x62,
      0x76, 0x69, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x30, 0x53, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x22, 0x3a, 0x7b,
      0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x22, 0x62, 0x69, 0x6e, 0x61, 0x72, 0x79, 0x5f, 0x67, 0x6c, 0x54,
      0x46, 0x22, 0x2c, 0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22, 0x3a, 0x37, 0x32, 0x2c, 0x22,
      0x62, 0x79, 0x74, 0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x38, 0x34, 0x7d, 0x2c, 0x22, 0x62, 0x76, 0x69,
      0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x30, 0x53, 0x75, 0x72, 0x66, 0x61, 0x63, 0x65, 0x22, 0x3a, 0x7b, 0x22, 0x62, 0x75,
      0x66, 0x66, 0x65, 0x72, 0x22, 0x3a, 0x22, 0x62, 0x69, 0x6e, 0x61, 0x72, 0x79, 0x5f, 0x67, 0x6c, 0x54, 0x46, 0x22, 0x2c,
      0x22, 0x62, 0x79, 0x74, 0x65, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x22, 0x3a, 0x31, 0x38, 0x2c, 0x22, 0x62, 0x79, 0x74,
      0x65, 0x4f, 0x66, 0x66, 0x73, 0x65, 0x74, 0x22, 0x3a, 0x36, 0x34, 0x7d, 0x7d, 0x2c, 0x22, 0x65, 0x78, 0x74, 0x65, 0x6e,
      0x73, 0x69, 0x6f, 0x6e, 0x73, 0x55, 0x73, 0x65, 0x64, 0x22, 0x3a, 0x5b, 0x22, 0x4b, 0x48, 0x52, 0x5f, 0x62, 0x69, 0x6e,
      0x61, 0x72, 0x79, 0x5f, 0x67, 0x6c, 0x54, 0x46, 0x22, 0x2c, 0x22, 0x57, 0x45, 0x42, 0x33, 0x44, 0x5f, 0x71, 0x75, 0x61,
      0x6e, 0x74, 0x69, 0x7a, 0x65, 0x64, 0x5f, 0x61, 0x74, 0x74, 0x72, 0x69, 0x62, 0x75, 0x74, 0x65, 0x73, 0x22, 0x5d, 0x2c,
      0x22, 0x67, 0x6c, 0x45, 0x78, 0x74, 0x65, 0x6e, 0x73, 0x69, 0x6f, 0x6e, 0x73, 0x55, 0x73, 0x65, 0x64, 0x22, 0x3a, 0x5b,
      0x22, 0x4f, 0x45, 0x53, 0x5f, 0x65, 0x6c, 0x65, 0x6d, 0x65, 0x6e, 0x74, 0x5f, 0x69, 0x6e, 0x64, 0x65, 0x78, 0x5f, 0x75,
      0x69, 0x6e, 0x74, 0x22, 0x5d, 0x2c, 0x22, 0x6d, 0x61, 0x74, 0x65, 0x72, 0x69, 0x61, 0x6c, 0x73, 0x22, 0x3a, 0x7b, 0x22,
      0x4d, 0x61, 0x74, 0x65, 0x72, 0x69, 0x61, 0x6c, 0x30, 0x22, 0x3a, 0x7b, 0x22, 0x63, 0x61, 0x74, 0x65, 0x67, 0x6f, 0x72,
      0x79, 0x49, 0x64, 0x22, 0x3a, 0x22, 0x30, 0x78, 0x31, 0x37, 0x22, 0x2c, 0x22, 0x66, 0x69, 0x6c, 0x6c, 0x43, 0x6f, 0x6c,
      0x6f, 0x72, 0x22, 0x3a, 0x36, 0x35, 0x32, 0x38, 0x30, 0x2c, 0x22, 0x66, 0x69, 0x6c, 0x6c, 0x46, 0x6c, 0x61, 0x67, 0x73,
      0x22, 0x3a, 0x30, 0x2c, 0x22, 0x69, 0x67, 0x6e, 0x6f, 0x72, 0x65, 0x4c, 0x69, 0x67, 0x68, 0x74, 0x69, 0x6e, 0x67, 0x22,
      0x3a, 0x66, 0x61, 0x6c, 0x73, 0x65, 0x2c, 0x22, 0x6c, 0x69, 0x6e, 0x65, 0x43, 0x6f, 0x6c, 0x6f, 0x72, 0x22, 0x3a, 0x36,
      0x35, 0x32, 0x38, 0x30, 0x2c, 0x22, 0x6c, 0x69, 0x6e, 0x65, 0x50, 0x69, 0x78, 0x65, 0x6c, 0x73, 0x22, 0x3a, 0x30, 0x2c,
      0x22, 0x6c, 0x69, 0x6e, 0x65, 0x57, 0x69, 0x64, 0x74, 0x68, 0x22, 0x3a, 0x31, 0x2c, 0x22, 0x73, 0x75, 0x62, 0x43, 0x61,
      0x74, 0x65, 0x67, 0x6f, 0x72, 0x79, 0x49, 0x64, 0x22, 0x3a, 0x22, 0x30, 0x78, 0x31, 0x38, 0x22, 0x2c, 0x22, 0x74, 0x79,
      0x70, 0x65, 0x22, 0x3a, 0x30, 0x7d, 0x7d, 0x2c, 0x22, 0x6d, 0x65, 0x73, 0x68, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x4d,
      0x65, 0x73, 0x68, 0x5f, 0x52, 0x6f, 0x6f, 0x74, 0x22, 0x3a, 0x7b, 0x22, 0x70, 0x72, 0x69, 0x6d, 0x69, 0x74, 0x69, 0x76,
      0x65, 0x73, 0x22, 0x3a, 0x5b, 0x7b, 0x22, 0x65, 0x64, 0x67, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x73, 0x65, 0x67, 0x6d,
      0x65, 0x6e, 0x74, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x65, 0x6e, 0x64, 0x50, 0x6f, 0x69, 0x6e, 0x74, 0x41, 0x6e, 0x64, 0x51,
      0x75, 0x61, 0x64, 0x49, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x22, 0x3a, 0x22, 0x62, 0x76, 0x65, 0x6e, 0x64, 0x50, 0x6f,
      0x69, 0x6e, 0x74, 0x41, 0x6e, 0x64, 0x51, 0x75, 0x61, 0x64, 0x49, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x30, 0x53, 0x65,
      0x67, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x22, 0x2c, 0x22, 0x69, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x22, 0x3a, 0x22, 0x62,
      0x76, 0x69, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x30, 0x53, 0x65, 0x67, 0x6d, 0x65, 0x6e, 0x74, 0x73, 0x22, 0x7d, 0x7d,
      0x2c, 0x22, 0x69, 0x73, 0x50, 0x6c, 0x61, 0x6e, 0x61, 0x72, 0x22, 0x3a, 0x74, 0x72, 0x75, 0x65, 0x2c, 0x22, 0x6d, 0x61,
      0x74, 0x65, 0x72, 0x69, 0x61, 0x6c, 0x22, 0x3a, 0x22, 0x4d, 0x61, 0x74, 0x65, 0x72, 0x69, 0x61, 0x6c, 0x30, 0x22, 0x2c,
      0x22, 0x73, 0x75, 0x72, 0x66, 0x61, 0x63, 0x65, 0x22, 0x3a, 0x7b, 0x22, 0x69, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x22,
      0x3a, 0x22, 0x62, 0x76, 0x69, 0x6e, 0x64, 0x69, 0x63, 0x65, 0x73, 0x30, 0x53, 0x75, 0x72, 0x66, 0x61, 0x63, 0x65, 0x22,
      0x2c, 0x22, 0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x31, 0x7d, 0x2c, 0x22, 0x74, 0x79, 0x70, 0x65, 0x22, 0x3a, 0x30, 0x2c,
      0x22, 0x76, 0x65, 0x72, 0x74, 0x69, 0x63, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x62, 0x75, 0x66, 0x66, 0x65, 0x72, 0x56,
      0x69, 0x65, 0x77, 0x22, 0x3a, 0x22, 0x62, 0x76, 0x56, 0x65, 0x72, 0x74, 0x65, 0x78, 0x30, 0x22, 0x2c, 0x22, 0x63, 0x6f,
      0x75, 0x6e, 0x74, 0x22, 0x3a, 0x34, 0x2c, 0x22, 0x66, 0x65, 0x61, 0x74, 0x75, 0x72, 0x65, 0x49, 0x44, 0x22, 0x3a, 0x30,
      0x2c, 0x22, 0x66, 0x65, 0x61, 0x74, 0x75, 0x72, 0x65, 0x49, 0x6e, 0x64, 0x65, 0x78, 0x54, 0x79, 0x70, 0x65, 0x22, 0x3a,
      0x31, 0x2c, 0x22, 0x68, 0x61, 0x73, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x6c, 0x75, 0x63, 0x65, 0x6e, 0x63, 0x79, 0x22, 0x3a,
      0x66, 0x61, 0x6c, 0x73, 0x65, 0x2c, 0x22, 0x68, 0x65, 0x69, 0x67, 0x68, 0x74, 0x22, 0x3a, 0x31, 0x2c, 0x22, 0x6e, 0x75,
      0x6d, 0x52, 0x67, 0x62, 0x61, 0x50, 0x65, 0x72, 0x56, 0x65, 0x72, 0x74, 0x65, 0x78, 0x22, 0x3a, 0x34, 0x2c, 0x22, 0x70,
      0x61, 0x72, 0x61, 0x6d, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x64, 0x65, 0x63, 0x6f, 0x64, 0x65, 0x4d, 0x61, 0x74, 0x72, 0x69,
      0x78, 0x22, 0x3a, 0x5b, 0x37, 0x2e, 0x36, 0x33, 0x30, 0x36, 0x35, 0x35, 0x33, 0x37, 0x34, 0x39, 0x39, 0x30, 0x34, 0x36,
      0x31, 0x31, 0x65, 0x2d, 0x30, 0x35, 0x2c, 0x30, 0x2e, 0x30, 0x2c, 0x30, 0x2e, 0x30, 0x2c, 0x30, 0x2e, 0x30, 0x2c, 0x30,
      0x2e, 0x30, 0x2c, 0x30, 0x2e, 0x30, 0x30, 0x30, 0x31, 0x35, 0x32, 0x36, 0x31, 0x33, 0x31, 0x30, 0x37, 0x34, 0x39, 0x39,
      0x38, 0x30, 0x39, 0x32, 0x32, 0x2c, 0x30, 0x2e, 0x30, 0x2c, 0x30, 0x2e, 0x30, 0x2c, 0x30, 0x2e, 0x30, 0x2c, 0x30, 0x2e,
      0x30, 0x2c, 0x31, 0x2e, 0x35, 0x32, 0x36, 0x31, 0x33, 0x31, 0x30, 0x37, 0x34, 0x39, 0x39, 0x38, 0x30, 0x39, 0x32, 0x38,
      0x65, 0x2d, 0x30, 0x38, 0x2c, 0x30, 0x2e, 0x30, 0x2c, 0x2d, 0x32, 0x2e, 0x35, 0x30, 0x30, 0x33, 0x37, 0x34, 0x39, 0x39,
      0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x36, 0x2c, 0x2d, 0x35, 0x2e, 0x30, 0x30, 0x30, 0x37, 0x34, 0x39, 0x39, 0x39,
      0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x31, 0x2c, 0x2d, 0x30, 0x2e, 0x30, 0x30, 0x30, 0x35, 0x30, 0x30, 0x30, 0x37,
      0x35, 0x30, 0x2c, 0x31, 0x2e, 0x30, 0x5d, 0x2c, 0x22, 0x64, 0x65, 0x63, 0x6f, 0x64, 0x65, 0x64, 0x4d, 0x61, 0x78, 0x22,
      0x3a, 0x5b, 0x32, 0x2e, 0x35, 0x30, 0x30, 0x33, 0x37, 0x34, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x36,
      0x2c, 0x35, 0x2e, 0x30, 0x30, 0x30, 0x37, 0x34, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x31, 0x2c,
      0x30, 0x2e, 0x30, 0x30, 0x30, 0x35, 0x30, 0x30, 0x30, 0x37, 0x35, 0x30, 0x5d, 0x2c, 0x22, 0x64, 0x65, 0x63, 0x6f, 0x64,
      0x65, 0x64, 0x4d, 0x69, 0x6e, 0x22, 0x3a, 0x5b, 0x2d, 0x32, 0x2e, 0x35, 0x30, 0x30, 0x33, 0x37, 0x34, 0x39, 0x39, 0x39,
      0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x36, 0x2c, 0x2d, 0x35, 0x2e, 0x30, 0x30, 0x30, 0x37, 0x34, 0x39, 0x39, 0x39, 0x39,
      0x39, 0x39, 0x39, 0x39, 0x39, 0x39, 0x31, 0x2c, 0x2d, 0x30, 0x2e, 0x30, 0x30, 0x30, 0x35, 0x30, 0x30, 0x30, 0x37, 0x35,
      0x30, 0x5d, 0x7d, 0x2c, 0x22, 0x75, 0x6e, 0x69, 0x66, 0x6f, 0x72, 0x6d, 0x43, 0x6f, 0x6c, 0x6f, 0x72, 0x22, 0x3a, 0x36,
      0x35, 0x32, 0x38, 0x30, 0x2c, 0x22, 0x77, 0x69, 0x64, 0x74, 0x68, 0x22, 0x3a, 0x31, 0x36, 0x7d, 0x7d, 0x5d, 0x7d, 0x7d,
      0x2c, 0x22, 0x6e, 0x6f, 0x64, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x4e, 0x6f, 0x64, 0x65, 0x5f, 0x52, 0x6f, 0x6f, 0x74,
      0x22, 0x3a, 0x22, 0x4d, 0x65, 0x73, 0x68, 0x5f, 0x52, 0x6f, 0x6f, 0x74, 0x22, 0x7d, 0x2c, 0x22, 0x73, 0x63, 0x65, 0x6e,
      0x65, 0x22, 0x3a, 0x22, 0x64, 0x65, 0x66, 0x61, 0x75, 0x6c, 0x74, 0x53, 0x63, 0x65, 0x6e, 0x65, 0x22, 0x2c, 0x22, 0x73,
      0x63, 0x65, 0x6e, 0x65, 0x73, 0x22, 0x3a, 0x7b, 0x22, 0x64, 0x65, 0x66, 0x61, 0x75, 0x6c, 0x74, 0x53, 0x63, 0x65, 0x6e,
      0x65, 0x22, 0x3a, 0x7b, 0x22, 0x6e, 0x6f, 0x64, 0x65, 0x73, 0x22, 0x3a, 0x5b, 0x22, 0x72, 0x6f, 0x6f, 0x74, 0x4e, 0x6f,
      0x64, 0x65, 0x22, 0x5d, 0x7d, 0x7d, 0x7d, 0x0a, 0x03, 0x00, 0x03, 0x00, 0xfe, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x80, 0x80, 0xcc, 0xcc, 0xf8, 0xff, 0x03, 0x00, 0xfe, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x80, 0xcc, 0xcc,
      0xf8, 0xff, 0xf8, 0xff, 0xfe, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x80, 0xcc, 0xcc, 0x03, 0x00, 0xf8, 0xff,
      0xfe, 0x7f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80, 0x80, 0xcc, 0xcc, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x02, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x00, 0x03, 0x00, 0x00, 0x01, 0x00, 0x00, 0x02, 0x00, 0x00, 0x01, 0x00, 0x00, 0x01, 0x00, 0x00,
      0x02, 0x00, 0x00, 0x02, 0x00, 0x00, 0x02, 0x00, 0x00, 0x03, 0x00, 0x00, 0x02, 0x00, 0x00, 0x02, 0x00, 0x00, 0x03, 0x00,
      0x00, 0x03, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x01, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x01,
      0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0x03, 0x00, 0x00, 0x01,
      0x03, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x02, 0x00, 0x00, 0x00, 0x03, 0x02, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x02,
      0x02, 0x00, 0x00, 0x01, 0x02, 0x00, 0x00, 0x01, 0x01, 0x00, 0x00, 0x02, 0x01, 0x00, 0x00, 0x03, 0x03, 0x00, 0x00, 0x00,
      0x02, 0x00, 0x00, 0x02, 0x03, 0x00, 0x00, 0x01, 0x03, 0x00, 0x00, 0x01, 0x02, 0x00, 0x00, 0x02, 0x02, 0x00, 0x00, 0x03,
    ]);

    const parser = acquireImdlParser({});
    const document = await parser.parse({
      data: tileData,
      batchModelId: "0x123",
      is3d: true,
      maxVertexTableSize: 4096,
    });

    expect(typeof document).toEqual("object");

    parser.release();
  });
});