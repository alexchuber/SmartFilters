import type { SerializedBlockDefinitionV1 } from "./v1/blockSerialization.types";

/**
 * Type union of all versions of serialized SmartFilter block definitions
 * A block definition is an object which is used to create a CustomShaderBlock instance.
 */
export type SerializedBlockDefinition = SerializedBlockDefinitionV1;
