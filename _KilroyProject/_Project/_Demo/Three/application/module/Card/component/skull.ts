import * as THREE from 'three';

import Component from '../../../interface/component';

// @ts-ignore
import vertSkull from '../shader/vertSkull.shader';
// @ts-ignore
import fragSkull from '../shader/fragSkull.shader';

export interface SkullConfig { // 骷髅配置
    
    texture: SkullTexture
}

export interface SkullTexture { // 骷髅纹理
    skull: THREE.Group; // 骷髅
}

/**
 * 骷髅
 */
export default class Skull implements Component {
    private readonly name: string = 'Skull-骷髅';
    
    private texture: SkullTexture = null; // 纹理
    
    private eyeLeft: THREE.Mesh = null; // 左眼
    private eyeRight: THREE.Mesh = null; // 右眼
    private skull: THREE.Group = null; // 骷髅
    private material: THREE.ShaderMaterial = null; // 材质
    private depth: number = -15; // 深度
    private scale: number = 2.5; // 缩放尺寸
    private cycle: number = 0; // 周期
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Skull
     * @param {SkullConfig} config 配置
     */
    constructor(config: SkullConfig) {
        this.texture = config.texture;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        this.createEye();
        this.createSkull();
        
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, 3 * this.scale, 0);
        this.instance.scale.set(this.scale, this.scale, this.scale);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.instance.add(this.eyeLeft);
        this.instance.add(this.eyeRight);
        this.instance.add(this.skull);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const cycleS = 2;
        
        this.cycle += cycleS;
        this.material.uniforms._time.value = this.cycle / 1000;
    }
    
    /**
     * 创建眼睛
     */
    private createEye(): void {
        const geometry = new THREE.SphereGeometry(1.5, 32, 32),
            material = new THREE.MeshBasicMaterial();
        
        material.color.setRGB(0, 150, 255);
        
        this.eyeLeft = new THREE.Mesh(geometry, material);
        this.eyeLeft.position.set(-2.2, -2.2, this.depth + 3.4);
        
        this.eyeRight = new THREE.Mesh(geometry, material);
        this.eyeRight.position.set(2.2, -2.2, this.depth + 3.4);
    }
    
    /**
     * 创建骷髅
     */
    private createSkull(): void {
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                _color_1: {
                    value: new THREE.Vector3(65, 0, 170)
                },
                _color_2: {
                    value: new THREE.Vector3(197, 81, 245)
                },
                _time: {
                    value: 0.0
                }
            },
            vertexShader: vertSkull,
            fragmentShader: fragSkull,
            transparent: true,
            depthWrite: false
        });
        
        this.skull = this.texture.skull;
        this.skull.position.set(0, 0, this.depth);
        this.skull.rotation.set(Math.PI, 0, Math.PI);
        this.skull.scale.set(8, 8, 8);
        this.skull.children.forEach((v: THREE.Mesh, i: number, a: THREE.Object3D[]) => {
            v.material = this.material;
        });
    }
}
