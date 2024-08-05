/* eslint-disable @typescript-eslint/naming-convention */
import { BlockTools } from "../../blockTools.js";
import type { IDisplayManager } from "@babylonjs/shared-ui-components/nodeGraphSystem/interfaces/displayManager";
import type { INodeData } from "@babylonjs/shared-ui-components/nodeGraphSystem/interfaces/nodeData";
import styles from "../../assets/styles/graphSystem/display/inputDisplayManager.modules.scss";
import { ConnectionPointType } from "@babylonjs/smart-filters";
import { Color3 } from "@babylonjs/core/Maths/math.color.js";
import type { AnyInputBlock } from "@babylonjs/smart-filters";

export class InputDisplayManager implements IDisplayManager {
    public getHeaderClass(_nodeData: INodeData) {
        return styles["constant"]!;

        // const inputBlock = nodeData.data as InputBlock;

        // return styles["constant"];
        // if (inputBlock.isConstant) {
        // }

        // if (inputBlock.visibleInInspector) {
        //     return styles["inspector"];
        // }

        // return "";
    }

    public shouldDisplayPortLabels(): boolean {
        return false;
    }

    public getHeaderText(nodeData: INodeData): string {
        const inputBlock = nodeData.data as AnyInputBlock;
        const name = `${inputBlock.name} (${InputDisplayManager.GetBaseType(inputBlock.type)})`;
        return name;
    }

    public static GetBaseType(type: ConnectionPointType): string {
        return ConnectionPointType[type]!;
    }

    public getBackgroundColor(nodeData: INodeData): string {
        let color = "";
        const inputBlock = nodeData.data as AnyInputBlock;

        switch (inputBlock.type) {
            case ConnectionPointType.Color3: {
                const inputColor = inputBlock.runtimeValue.value;
                const color3 = new Color3(inputColor.r, inputColor.g, inputColor.b);
                color = color3.toHexString();
                break;
            }
            default:
                color = BlockTools.GetColorFromConnectionNodeType(inputBlock.type);
                break;
        }

        return color;
    }

    public updatePreviewContent(nodeData: INodeData, contentArea: HTMLDivElement): void {
        let value = "";
        const inputBlock = nodeData.data as AnyInputBlock;

        switch (inputBlock.type) {
            case ConnectionPointType.Boolean:
                value = inputBlock.runtimeValue.value ? "True" : "False";
                break;
            case ConnectionPointType.Float:
                value = inputBlock.runtimeValue.value.toFixed(4);
                break;
            case ConnectionPointType.Texture: {
                value = `<img src="${inputBlock.runtimeValue.value?.getInternalTexture()?.url}" />`;
                break;
            }
        }

        contentArea.innerHTML = value;
        contentArea.classList.add(styles["input-block"]!);
    }
}