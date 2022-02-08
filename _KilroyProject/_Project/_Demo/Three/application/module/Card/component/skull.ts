import * as THREE from 'three';

import Component from '../../../interface/component';
import Global from '../../../../../1/_global';

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
        const _this = this;
        
        _this.texture = config.texture;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const _this = this;
        
        _this.createEye();
        _this.createSkull();
        
        _this.instance = new THREE.Group();
        _this.instance.name = _this.name;
        _this.instance.position.set(0, 3 * _this.scale, 0);
        _this.instance.scale.set(_this.scale, _this.scale, _this.scale);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.instance.add(_this.eyeLeft);
        _this.instance.add(_this.eyeRight);
        _this.instance.add(_this.skull);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const _this = this,
            cycleS = 2;
        
        _this.cycle += cycleS;
        _this.material.uniforms._time.value = _this.cycle / 1000;
    }
    
    /**
     * 创建眼睛
     */
    private createEye(): void {
        const _this = this,
            geometry = new THREE.SphereGeometry(1.5, 32, 32),
            material = new THREE.MeshBasicMaterial();
        
        material.color.setRGB(0, 150, 255);
        
        _this.eyeLeft = new THREE.Mesh(geometry, material);
        _this.eyeLeft.position.set(-2.2, -2.2, _this.depth + 3.4);
        
        _this.eyeRight = new THREE.Mesh(geometry, material);
        _this.eyeRight.position.set(2.2, -2.2, _this.depth + 3.4);
    }
    
    /**
     * 创建骷髅
     */
    private createSkull(): void {
        const _this = this;
        
        _this.material = new THREE.ShaderMaterial({
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
        
        _this.skull = _this.texture.skull;
        _this.skull.position.set(0, 0, _this.depth);
        _this.skull.rotation.set(Math.PI, 0, Math.PI);
        _this.skull.scale.set(8, 8, 8);
        _this.skull.children.forEach((v: THREE.Mesh, i: number, a: THREE.Object3D[]) => {
            v.material = _this.material;
        });
    }
}
