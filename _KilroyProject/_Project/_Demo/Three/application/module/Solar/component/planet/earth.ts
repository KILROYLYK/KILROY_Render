import * as THREE from 'three';

import Component from '../../../../interface/component';
import Stage from '../../stage';

export interface Texture { // 纹理
    earth: THREE.Texture // 地球
    sky: THREE.Texture // 天空
}

/**
 * 地球
 */
export default class Earth implements Component {
    private readonly name: string = 'Earth-地球';
    
    private scene: THREE.Scene = null; // 场景
    private texture: Texture = null; // 纹理
    
    private readonly radius: number = Stage.radiusM * 26.1; // 半径
    private readonly trackR: number = Stage.trackIR + Stage.trackM * 2.58; // 轨迹半径
    private cycle: number = 0; // 周期
    private track: THREE.Mesh = null; // 轨道
    private planet: THREE.Mesh = null; // 星球
    private sky: THREE.Mesh = null; // 天空
    
    public group: THREE.Group = null; // 组
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Earth
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
        this.group = new THREE.Group();
        this.group.position.set(0, 0, this.trackR);
        
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, 0, 0);
        this.instance.rotation.set(0, 2 * Math.PI / 8 * 2, 0);
        
        this.createTrack();
        this.createPlanet();
        this.createSky();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.group.add(this.planet);
        this.group.add(this.sky);
        
        this.instance.add(this.track);
        this.instance.add(this.group);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const cycleS = 0.006; // 周期速度
        
        if (!this.instance) return;
        
        this.cycle += cycleS / 10;
        
        this.planet.rotateY(cycleS);
        
        this.sky.rotateX(cycleS);
        this.sky.rotateY(cycleS);
        
        this.group.position.x = Math.cos(this.cycle) * this.trackR;
        this.group.position.z = Math.sin(this.cycle) * this.trackR;
        this.group.rotateY(-cycleS);
    }
    
    /**
     * 创建轨道
     */
    private createTrack(): void {
        const geometry = new THREE.RingGeometry(this.trackR - 1, this.trackR, 128
        );
        
        const material = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            side: THREE.DoubleSide
        });
        
        this.track = new THREE.Mesh(geometry, material);
        this.track.rotation.set(Math.PI / 2, 0, 0);
    }
    
    /**
     * 创建星球
     */
    private createPlanet(): void {
        const texture = this.texture.earth;
        
        texture.anisotropy = 4;
        texture.encoding = THREE.sRGBEncoding;
        
        const geometry = new THREE.SphereBufferGeometry(
            this.radius, 32, 32
        );
        
        const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 1
        });
        
        this.planet = new THREE.Mesh(geometry, material);
        this.planet.position.set(0, 0, 0);
        this.planet.castShadow = true;
        this.planet.receiveShadow = true;
    }
    
    /**
     * 创建天空
     */
    private createSky(): void {
        const texture = this.texture.sky;
        
        texture.anisotropy = 4;
        texture.encoding = THREE.sRGBEncoding;
        
        const geometry = new THREE.SphereBufferGeometry(this.radius + 0.5, 32, 32
        );
        
        const material = new THREE.MeshStandardMaterial({
            alphaMap: texture,
            transparent: true
        });
        
        this.sky = new THREE.Mesh(geometry, material);
        this.sky.position.set(0, 0, 0);
    }
}
