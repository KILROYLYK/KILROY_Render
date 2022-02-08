import * as THREE from 'three';

import Component from '../../../interface/component';

// @ts-ignore
import SunVertex from '../shader/vertSun.shader';
// @ts-ignore
import SunFragment from '../shader/fragSun.shader';

export interface Texture { // 纹理
    sun: THREE.Texture // 太阳
    ground: THREE.Texture // 地面
    fire: THREE.Texture // 火焰
}

/**
 * 太阳
 */
export default class Sun implements Component {
    private readonly name: string = 'Sun-太阳';
    
    private scene: THREE.Scene = null; // 场景
    private texture: Texture = null; // 纹理
    
    private readonly radius: number = 500; // 半径
    private uniform: { // 匀实
        [uniform: string]: {
            value: any
        }
    } = null;
    private light: THREE.PointLight = null; // 点光源
    private sphere: THREE.Mesh = null; // 球体
    private halo: THREE.Mesh = null; // 球体
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Sun
     * @param {*} scene 场景
     * @param {Texture} texture 纹理
     */
    constructor(scene: any, texture: Texture) {
        this.scene = scene.instance;
        this.texture = texture;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, 0, 0);
        
        this.createLight();
        this.createSphere();
        this.createHalo();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.instance.add(this.light);
        this.instance.add(this.sphere);
        // this.instance.add(this.halo);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const cycleS = 0.001; // 周期速度
        
        if (!this.instance) return;
        
        this.uniform.time.value += cycleS * 10;
        
        this.sphere.rotateY(cycleS);
    }
    
    /**
     * 创建光源
     */
    private createLight(): void {
        const size = 2048;
        
        this.light = new THREE.PointLight('#ffffff', 1.5);
        this.light.position.set(0, 0, 0);
        this.light.castShadow = true;
        this.light.shadow.camera.near = 1;
        this.light.shadow.camera.far = 17000;
        this.light.shadow.mapSize.width = size;
        this.light.shadow.mapSize.height = size;
    }
    
    /**
     * 创建球体
     */
    private createSphere(): void {
        const textureGround = this.texture.ground,
            textureFire = this.texture.fire;
        
        textureFire.wrapS
            = textureFire.wrapT
            = THREE.RepeatWrapping;
        textureGround.wrapS
            = textureGround.wrapT
            = THREE.RepeatWrapping;
        
        this.uniform = {
            fogDensity: {
                value: 0.45
            },
            fogColor: {
                value: new THREE.Vector3(0, 0, 0)
            },
            time: {
                value: 1
            },
            uvScale: {
                value: new THREE.Vector2(3, 1)
            },
            texture1: {
                value: textureFire
            },
            texture2: {
                value: textureGround
            }
        };
        
        const geometry = new THREE.SphereGeometry(this.radius, 64, 64);
        
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniform,
            vertexShader: SunVertex,
            fragmentShader: SunFragment
        });
        
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.position.set(0, 0, 0);
    }
    
    /**
     * 创建光晕
     */
    private createHalo(): void {
        const texture = this.texture.sun;
        
        const geometry = new THREE.SphereGeometry(this.radius + 50, 64, 64);
        
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            lightMap: texture,
            lightMapIntensity: 10,
            roughness: 1,
            opacity: 0.2,
            transparent: true
        });
        
        this.halo = new THREE.Mesh(geometry, material);
        this.halo.position.set(0, 0, 0);
    }
}
