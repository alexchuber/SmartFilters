import type { Effect } from "@babylonjs/core/Materials/effect";

import type { SmartFilter, IDisableableBlock, RuntimeData } from "@babylonjs/smart-filters";
import { ShaderBlock, ConnectionPointType, ShaderBinding, injectDisableUniform } from "@babylonjs/smart-filters";
import { BlockNames } from "../blockNames";

const shaderProgram = injectDisableUniform({
    vertex: `
        // Attributes
        attribute vec2 position;
        
        // Output
        varying vec2 vUV;
        
        void main(void) {
            vUV = position;
            gl_Position = vec4(position, 0.0, 1.0);
        }
    `,

    fragment: {
        uniform: `
            uniform sampler2D _input_;
            uniform float _time_;
            `,

        const: `
            const int _numParticles_ = 50; // Number of particles (leaves/petals)
            const float _gravity_ = 0.05; // Gravity effect on particles
            const float _rotationSpeed_ = 0.2; // Speed of rotation
            const vec2 _wind_ = vec2(0.02, 0.0); // Wind effect (horizontal drift)
            const float _lifeSpan_ = 5.0; // Lifespan of particles in seconds
            const float _particleDiameter_ = 5.0;
            `,

        mainFunctionName: "_petal_",

        mainInputTexture: "_input_",

        functions: [
            {
                name: "GetPaletteColor",
                code: `
                vec3 GetPaletteColor(float t)
                {
                    vec3 a = vec3(0.74, 0.64, 0.24);
                    vec3 b = vec3(1.00, 0.28, 0.00);
                    vec3 c = vec3(0.19, 1.00, 0.17);
                    vec3 d = vec3(0.15, 0.60, 0.00);

                    return a + b * cos(radians(360.0) * (c * t + d));
                }
                `,
            },
            {
                name: "Rot",
                code: `
                mat2 Rot(float a)
                {
                    float s=sin(a), c=cos(a);
                    return mat2(c,-s,s,c);
                }
                `,
            },
            {
                name: "Transform",
                code: `
                vec3 Transform(vec3 p, float angle) {
                    p.xz *= Rot(angle );
                    p.xy *= Rot(angle * 1.7);

                    return p;
                }
                `,
            },
            {
                name: "Leaf",
                code: `
                float Leaf(vec2 p)
                {
                    float w = fwidth(p.y);

                    float d = length(p - vec2(0.0, clamp(p.y, -0.3, 0.3)));

                    float r = mix(0.07, .001, smoothstep(0.0, 0.3, abs(p.y - 0.03)));

                    float m = smoothstep(w, -w, d-r);
                    
                    float side = sign(p.x);

                    float x = 0.9 * abs(p.x) / r;
                    
                    float wave = (1.-x)*sqrt(x) + x*(1.-sqrt(1.-x));

                    float y = (p.y - wave * 0.2) * 20.0 + side * 243.75;

                    float id = floor(y + 20.0);

                    float n = fract(sin(id*564.32)*763.);
                    
                    float shade = mix(.8, 0.9, n);
                    
                    d = length(p - vec2(0.0, clamp(p.y, -0.3, 0.2)));
                    
                    float strand = smoothstep(.0, .1, abs( fract(y) - 0.5 ) - 0.4);

                    strand *= smoothstep(w, -w, x - 0.9);
                    strand *= smoothstep(-w, w, x - 0.02);
                    strand *= smoothstep(w, -w, abs(p.y) - 0.3);

                    float stem = smoothstep(w, -w, d + (p.y-0.3) * 0.01);
                    
                    return max(m * shade, max(stem, strand));
                }
                `,
            },
            {
                name: "ScrewLeaf",
                code: `
                float ScrewLeaf(vec2 p, float angle)
                {
                    p -= vec2(0,-.45);
                    float d = length(p);
                    p *= Rot(sin(angle) * 0.5 * d);

                    p += vec2(0,-.45);

                    return Leaf(p);
                }
                `,
            },
            {
                name: "LeafBall",
                code: `
                vec4 LeafBall(vec3 ro, vec3 rd, vec3 pos, vec3 color, float angle)
                {	
                    vec4 col = vec4(0);
                    
                    float t = dot(pos-ro, rd);
                    vec3 p = ro + rd * t;
                    float y = length(pos-p);
                    
                    if (y < 1.0)
                    {
                        float x = sqrt(1.-y*y);
                        vec3 pF = ro + rd * (t-x) - pos;
                        float n = pF.y*.5+.5;
                        
                        pF = Transform(pF, angle);
                        vec2 uvF = vec2(atan(pF.x, pF.z), pF.y); // -pi<>pi, -1<>1
                        uvF *= vec2(.25,.5);
                        
                        vec4 front = texture2D(_input_, uvF) * vec4(color, 1.0);
                        
                        vec3 pB = ro + rd * (t+x) - pos;
                        n = pB.y*.5+.5;
                        pB = Transform(pB, angle);
                        vec2 uvB = vec2(atan(pB.x, pB.z), pB.y); // -pi<>pi, -1<>1
                        uvB *= vec2(.25, .5);

                        vec4 back = texture2D(_input_, uvB) * vec4(color * 0.7, 1.0);

                        col = mix(back, front, front.a);
                    }
                    
                    return col;
                }
                `,
            },
            {
                name: "_petal_",
                code: `
                vec4 _petal_(vec2 vUV) {
                    vec2 uv = vUV;

                    vec4 col = vec4(0.0);
                    
                    vec3 ro = vec3(0.0, 0.0, -3.0);
                    vec3 rd = normalize(vec3(uv, 1.0));

                    for (float i = 0.0; i < 1.0; i += 1.0 / 30.0)
                    {
                        vec3 color = GetPaletteColor(1.0 -i);

                        float n = fract(sin(i*564.3)*4570.3);
                        float x = mix(-12., 12., n);
                        float y = mix(5.0, -5.0, fract(fract(n * 10.) + _time_ * 0.3));
                        
                        float z = mix(5., 0., i);
                        float a = _time_ * 1.2 + i * 53.34;
                        
                        vec4 leaf = LeafBall(ro, rd, vec3(x, y, z), color, a);
                        
                        leaf.rgb = mix(col.rgb, leaf.rgb, mix(.3, 1., i));
                        leaf.rgb = sqrt(leaf.rgb);
                        
                        col = mix(col, leaf, leaf.a);
                    }
                    
                    return col;
                }
            `,
            },
        ],
    },
});

/**
 * The shader bindings for the Petal block.
 */
export class PetalShaderBinding extends ShaderBinding {
    private readonly _inputTexture: RuntimeData<ConnectionPointType.Texture>;
    private readonly _time: RuntimeData<ConnectionPointType.Float>;

    /**
     * Creates a new shader binding instance for the Petal block.
     * @param parentBlock - The parent block
     * @param inputTexture - the input texture
     * @param time - the time
     */
    constructor(
        parentBlock: IDisableableBlock,
        inputTexture: RuntimeData<ConnectionPointType.Texture>,
        time: RuntimeData<ConnectionPointType.Float>
    ) {
        super(parentBlock);
        this._inputTexture = inputTexture;
        this._time = time;
    }

    /**
     * Binds all the required data to the shader when rendering.
     * @param effect - defines the effect to bind the data to
     */
    public override bind(effect: Effect): void {
        super.bind(effect);
        effect.setTexture(this.getRemappedName("input"), this._inputTexture.value);
        effect.setFloat(this.getRemappedName("time"), this._time.value);
    }
}

/**
 * A block performing a Petal looking like effect.
 */
export class PetalBlock extends ShaderBlock {
    /**
     * The class name of the block.
     */
    public static override ClassName = BlockNames.petal;

    /**
     * The input texture connection point.
     */
    public readonly input = this._registerInput("input", ConnectionPointType.Texture);

    /**
     * The time connection point.
     */
    public readonly time = this._registerInput("time", ConnectionPointType.Float);

    /**
     * The shader program (vertex and fragment code) to use to render the block
     */
    public static override ShaderCode = shaderProgram;

    /**
     * Instantiates a new Block.
     * @param smartFilter - The smart filter this block belongs to
     * @param name - The friendly name of the block
     */
    constructor(smartFilter: SmartFilter, name: string) {
        super(smartFilter, name);
    }

    /**
     * Get the class instance that binds all the required data to the shader (effect) when rendering.
     * @returns The class instance that binds the data to the effect
     */
    public getShaderBinding(): ShaderBinding {
        const input = this._confirmRuntimeDataSupplied(this.input);
        const time = this._confirmRuntimeDataSupplied(this.time);

        return new PetalShaderBinding(this, input, time);
    }
}
