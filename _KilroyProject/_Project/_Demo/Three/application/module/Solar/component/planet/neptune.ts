import * as THREE from 'three';

import Component from '../../../../interface/component';
import Stage from '../../stage'

/**
 * 海王星
 */
export default class Neptune implements Component {
    private readonly name: string = 'Neptune-海王星';
    
    private scene: THREE.Scene = null; // 场景
    private texture: THREE.Texture = null; // 纹理
    
    private readonly radius: number = Stage.radiusM * 101.5; // 半径
    private readonly trackR: number = Stage.trackIR + Stage.trackM * 77.77; // 轨迹半径
    private cycle: number = 0; // 周期
    private track: THREE.Mesh = null; // 轨道
    private planet: THREE.Mesh = null; // 星球
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Neptune
     * @param {*} scene 场景
     * @param {THREE.Texture} texture 纹理
     */
    constructor(scene: any, texture: THREE.Texture) {
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
        this.instance.rotation.set(0, 2 * Math.PI / 8 * 7, 0);
        
        this.createTrack();
        this.createPlanet();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.instance.add(this.track);
        this.instance.add(this.planet);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const cycleS = 0.001; // 周期速度
        
        if (!this.instance) return;
        
        this.cycle += cycleS / 10;
        
        this.planet.position.x = Math.cos(this.cycle) * this.trackR;
        this.planet.position.z = Math.sin(this.cycle) * this.trackR;
        this.planet.rotateY(cycleS);
    }
    
    /**
     * 创建轨道
     */
    private createTrack(): void {
        const geometry = new THREE.RingGeometry(this.trackR - 1, this.trackR, 128);
        
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
        this.texture.anisotropy = 4;
        this.texture.encoding = THREE.sRGBEncoding;
        
        const geometry = new THREE.SphereBufferGeometry(
            this.radius, 64, 64
        );
        
        const material = new THREE.MeshStandardMaterial({
            map: this.texture,
            roughness: 1
        });
        
        this.planet = new THREE.Mesh(geometry, material);
        this.planet.position.set(0, 0, this.trackR);
        this.planet.castShadow = true;
        this.planet.receiveShadow = true;
    }
}
