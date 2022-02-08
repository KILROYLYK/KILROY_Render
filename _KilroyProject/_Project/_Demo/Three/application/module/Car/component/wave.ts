import * as THREE from 'three';

import Component from '../../../interface/component';

// @ts-ignore
import vertWave from '../shader/vertWave.shader';
// @ts-ignore
import fragWave from '../shader/fragWave.shader';

/**
 * 波浪
 */
export default class Wave implements Component {
    private readonly name: string = 'Wave-波浪';
    
    private scene: THREE.Scene = null; // 场景
    
    private row: number = 30; // 列行数
    private cycle: number = 0; // 周期
    
    public instance: THREE.Points = null; // 实例
    
    /**
     * 构造函数
     * @constructor Wave
     * @param {*} scene 场景
     */
    constructor(scene: any) {
        this.scene = scene.instance;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const interval = 20, // 间隔
            particle = Math.pow(this.row, 2),
            positions = new Float32Array(particle * 3),
            scales = new Float32Array(particle);
        
        let i = 0,
            j = 0;
        
        for (let ix = 0; ix < this.row; ix++) {
            for (let iy = 0; iy < this.row; iy++) {
                positions[i] = ix * interval - ((this.row * interval) / 2); // x
                positions[i + 1] = 0; // y
                positions[i + 2] = iy * interval - ((this.row * interval) / 2); // z
                scales[j] = 1;
                i += 3;
                j++;
            }
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    value: new THREE.Color('#ffffff')
                },
            },
            vertexShader: vertWave,
            fragmentShader: fragWave
        });
        
        this.instance = new THREE.Points(geometry, material);
        this.instance.name = this.name;
        this.instance.position.set(0, 5, 0);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const slope = 2, // 坡度
            scale = 1, // 缩放
            geometry = this.instance.geometry as any,
            positions = geometry.attributes.position.array,
            scales = geometry.attributes.scale.array;
        
        let i = 0,
            j = 0;
        
        for (let ix = 0; ix < this.row; ix++) {
            for (let iy = 0; iy < this.row; iy++) {
                positions[i + 1] =
                    (Math.sin((ix + this.cycle) * 0.3) * slope) +
                    (Math.sin((iy + this.cycle) * 0.5) * slope);
                scales[j] =
                    (Math.sin((ix + this.cycle) * 0.3) + 1) * scale +
                    (Math.sin((iy + this.cycle) * 0.5) + 1) * scale;
                i += 3;
                j++;
            }
        }
        
        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.scale.needsUpdate = true;
        
        this.cycle -= 0.1;
    }
}
