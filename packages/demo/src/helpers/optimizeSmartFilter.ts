import { SmartFilterOptimizer, type SmartFilter } from "@babylonjs/smart-filters";
import type { ThinEngine } from "@babylonjs/core/Engines/thinEngine";

export function optimizeSmartFilter(smartFilter: SmartFilter, engine: ThinEngine): SmartFilter {
    const forceMaxSamplersInFragmentShader = 0;

    const optimizer = new SmartFilterOptimizer(smartFilter, {
        maxSamplersInFragmentShader: forceMaxSamplersInFragmentShader || engine.getCaps().maxTexturesImageUnits,
        removeDisabledBlocks: true,
    });

    try {
        // This might throw
        const optimizedSmartFilter = optimizer.optimize();

        // ... and, if the optimizer fails in other ways, it will return null
        if (optimizedSmartFilter === null) {
            throw new Error("Optimizer returned null");
        }

        return optimizedSmartFilter;
    } catch (e) {
        console.error("Failed to optimize SmartFilter", e);
        return smartFilter;
    }
}
