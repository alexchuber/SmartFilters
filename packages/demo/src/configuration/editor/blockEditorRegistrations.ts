import { defaultBlockEditorRegistrations } from "../../defaults/defaultBlockEditorRegistrations";
import { BlackAndWhiteAndBlurBlock } from "../blocks/effects/blackAndWhiteAndBlurBlock";
import { BlackAndWhiteBlock } from "../blocks/effects/blackAndWhiteBlock";
import { BlurBlock } from "../blocks/effects/blurBlock";
import { CompositionBlock } from "../blocks/effects/compositionBlock";
import { ContrastBlock } from "../blocks/effects/contrastBlock";
import { DesaturateBlock } from "../blocks/effects/desaturateBlock";
import { ExposureBlock } from "../blocks/effects/exposureBlock";
import { FrameBlock } from "../blocks/effects/frameBlock";
import { GlassBlock } from "../blocks/effects/glassBlock";
import { GreenScreenBlock } from "../blocks/effects/greenScreenBlock";
import { KaleidoscopeBlock } from "../blocks/effects/kaleidoscopeBlock";
import { PixelateBlock } from "../blocks/effects/pixelateBlock";
import { PosterizeBlock } from "../blocks/effects/posterizeBlock";
import { GlitchBlock } from "../blocks/transitions/glitchBlock";
import { TileBlock } from "../blocks/transitions/tileBlock";
import { WipeBlock } from "../blocks/transitions/wipeBlock";

import type { IBlockEditorRegistration } from "./IBlockEditorRegistration";
import { ConnectionPointType, CopyBlock, InputBlock, type SmartFilter } from "@babylonjs/smart-filters";

export const blockEditorRegistrations: IBlockEditorRegistration[] = [
    ...defaultBlockEditorRegistrations,
    {
        name: "WebCam",
        category: "Inputs",
        tooltip: "Supplies a texture from a webcam",
    },
    {
        name: "CopyBlock",
        factory: (smartFilter: SmartFilter) => new CopyBlock(smartFilter, "Copy"),
        category: "Effects",
        tooltip: "Copy the input texture to the output texture",
    },
    {
        name: "BlackAndWhiteBlock",
        factory: (smartFilter: SmartFilter) => new BlackAndWhiteBlock(smartFilter, "BlackAndWhite"),
        category: "Effects",
        tooltip: "Transform the input texture to black and white",
    },
    {
        name: "BlurBlock",
        factory: (smartFilter: SmartFilter) => new BlurBlock(smartFilter, "BlurBlock"),
        category: "Effects",
        tooltip: "Blur the input texture",
    },
    {
        name: "CompositionBlock",
        factory: (smartFilter: SmartFilter) => {
            const block = new CompositionBlock(smartFilter, "Composition");
            const top = new InputBlock(smartFilter, "Top", ConnectionPointType.Float, 0.0);
            const left = new InputBlock(smartFilter, "Left", ConnectionPointType.Float, 0.0);
            const width = new InputBlock(smartFilter, "With", ConnectionPointType.Float, 1.0);
            const height = new InputBlock(smartFilter, "Height", ConnectionPointType.Float, 1.0);

            top.output.connectTo(block.foregroundTop);
            left.output.connectTo(block.foregroundLeft);
            width.output.connectTo(block.foregroundWidth);
            height.output.connectTo(block.foregroundHeight);
            return block;
        },
        category: "Effects",
        tooltip: "Composite the foreground texture over the background texture",
    },
    {
        name: "FrameBlock",
        factory: (smartFilter: SmartFilter) => new FrameBlock(smartFilter, "Frame"),
        category: "Effects",
        tooltip: "Green screen like effect",
    },
    {
        name: "GlassBlock",
        factory: (smartFilter: SmartFilter) => new GlassBlock(smartFilter, "Glass"),
        category: "Effects",
        tooltip: "Creates a glass like effect",
    },
    {
        name: "KaleidoscopeBlock",
        factory: (smartFilter: SmartFilter) => {
            const block = new KaleidoscopeBlock(smartFilter, "Kaleidoscope");
            const input = new InputBlock(smartFilter, "Angle", ConnectionPointType.Float, 0);
            input.output.connectTo(block.time);
            return block;
        },
        category: "Effects",
        tooltip: "Kaleidoscope effect",
    },
    {
        name: "PosterizeBlock",
        factory: (smartFilter: SmartFilter) => {
            const block = new PosterizeBlock(smartFilter, "Posterize");
            const input = new InputBlock(smartFilter, "Intensity", ConnectionPointType.Float, 0.5);
            input.output.connectTo(block.intensity);
            return block;
        },
        category: "Effects",
        tooltip: "Posterize to the input texture",
    },
    {
        name: "DesaturateBlock",
        factory: (smartFilter: SmartFilter) => {
            const block = new DesaturateBlock(smartFilter, "Desaturate");
            const input = new InputBlock(smartFilter, "Intensity", ConnectionPointType.Float, 0.5);
            input.output.connectTo(block.intensity);
            return block;
        },
        category: "Effects",
        tooltip: "Applies a desaturated effect to the input texture",
    },
    {
        name: "ContrastBlock",
        factory: (smartFilter: SmartFilter) => {
            const block = new ContrastBlock(smartFilter, "Contrast");
            const input = new InputBlock(smartFilter, "Intensity", ConnectionPointType.Float, 0.5);
            input.output.connectTo(block.intensity);
            return block;
        },
        category: "Effects",
        tooltip: "Change the contrast of the input texture",
    },
    {
        name: "GreenScreenBlock",
        factory: (smartFilter: SmartFilter) => {
            const block = new GreenScreenBlock(smartFilter, "GreenScreen");
            const reference = new InputBlock(smartFilter, "Reference", ConnectionPointType.Color3, {
                r: 92 / 255,
                g: 204 / 255,
                b: 78 / 255,
            });
            const distance = new InputBlock(smartFilter, "Distance", ConnectionPointType.Float, 0.25);
            reference.output.connectTo(block.reference);
            distance.output.connectTo(block.distance);
            return block;
        },
        category: "Effects",
        tooltip: "Replaces a green screen background with a different texture",
    },
    {
        name: "BlackAndWhiteAndBlurBlock",
        factory: (smartFilter: SmartFilter) => new BlackAndWhiteAndBlurBlock(smartFilter, "BlackAndWhiteAndBlurBlock"),
        category: "Effects",
        tooltip: "Transforms the input texture to black and white and blurs it",
    },
    {
        name: "GlitchBlock",
        factory: (smartFilter: SmartFilter) => new GlitchBlock(smartFilter, "Glitch"),
        category: "Transitions",
        tooltip: "Funky glitch transition",
    },
    {
        name: "TileBlock",
        factory: (smartFilter: SmartFilter) => new TileBlock(smartFilter, "Tile"),
        category: "Transitions",
        tooltip: "Transition from one texture to another using tiles",
    },
    {
        name: "WipeBlock",
        factory: (smartFilter: SmartFilter) => new WipeBlock(smartFilter, "Wipe"),
        category: "Transitions",
        tooltip: "Transition from one texture to another using a wipe",
    },
    {
        name: "PixelateBlock",
        factory: (smartFilter: SmartFilter) => {
            const block = new PixelateBlock(smartFilter, "Pixelate");
            const input = new InputBlock(smartFilter, "Intensity", ConnectionPointType.Float, 0.4);
            input.output.connectTo(block.intensity);
            return block;
        },
        category: "Effects",
        tooltip: "Add pixelation to the input texture",
    },
    {
        name: "ExposureBlock",
        factory: (smartFilter: SmartFilter) => {
            const block = new ExposureBlock(smartFilter, "Exposure");
            const input = new InputBlock(smartFilter, "Amount", ConnectionPointType.Float, 0.7);
            input.output.connectTo(block.amount);
            return block;
        },
        category: "Effects",
        tooltip: "Alters the exposure of the input texture",
    },
];