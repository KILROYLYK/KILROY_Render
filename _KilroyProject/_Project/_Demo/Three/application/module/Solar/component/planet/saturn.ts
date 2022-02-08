import * as THREE from 'three';

import Component from '../../../../interface/component';
import Stage from '../../stage'

export interface Texture { // 纹理
    saturn: THREE.Texture // 土星
    ring: THREE.Texture // 星环
}

/**
 * 土星
 */
export default class Saturn implements Component {
    private readonly name: string = 'Saturn-土星';
    
    private scene: THREE.Scene = null; // 场景
    private texture: Texture = null; // 纹理
    
    private readonly radius: number = Stage.radiusM * 247; // 半径
    private readonly trackR: number = Stage.trackIR + Stage.trackM * 24.68; // 轨迹半径
    private cycle: number = 0; // 周期
    private track: THREE.Mesh = null; // 轨道
    private planet: THREE.Mesh = null; // 星球
    private ring: THREE.Mesh = null; // 星环
    
    public group: THREE.Group = null; // 组
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Saturn
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
        this.instance.rotation.set(0, 2 * Math.PI / 8 * 5, 0);
        
        this.createTrack();
        this.createPlanet();
        this.createRing();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.group.add(this.planet);
        this.group.add(this.ring);
        
        this.instance.add(this.track);
        this.instance.add(this.group);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const cycleS = 0.003; // 周期速度
        
        if (!this.instance) return;
        
        this.cycle += cycleS / 10;
        
        this.planet.rotateY(cycleS);
        
        this.group.position.x = Math.cos(this.cycle) * this.trackR;
        this.group.position.z = Math.sin(this.cycle) * this.trackR;
        this.group.rotateY(-cycleS);
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
        const texture = this.texture.saturn;
        
        texture.anisotropy = 4;
        texture.encoding = THREE.sRGBEncoding;
        
        const geometry = new THREE.SphereBufferGeometry(this.radius, 64, 64);
        
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
     * 创建星环
     */
    private createRing(): void {
        const texture = this.texture.ring,
            innerRadius = this.radius + 50,
            outerRadius = this.radius + 350,
            thetaSegments = 64,
            angle = Math.PI * 2;
        
        texture.anisotropy = 4;
        texture.encoding = THREE.sRGBEncoding;
        
        const geometry = new THREE.RingGeometry(
            innerRadius, outerRadius, thetaSegments
        );
        // geometry.vertices = [];
        // geometry.faces = [];
        // geometry.faceVertexUvs[0] = [];
        // for (let i = 0; i < (thetaSegments + 1); i++) {
        //     const fRad1 = i / thetaSegments,
        //         fRad2 = (i + 1) / thetaSegments,
        //         fX1 = innerRadius * Math.cos(fRad1 * angle),
        //         fY1 = innerRadius * Math.sin(fRad1 * angle),
        //         fX2 = outerRadius * Math.cos(fRad1 * angle),
        //         fY2 = outerRadius * Math.sin(fRad1 * angle),
        //         fX3 = outerRadius * Math.cos(fRad2 * angle),
        //         fY3 = outerRadius * Math.sin(fRad2 * angle),
        //         fX4 = innerRadius * Math.cos(fRad2 * angle),
        //         fY4 = innerRadius * Math.sin(fRad2 * angle),
        //         v1 = new THREE.Vector3(fX1, fY1, 0),
        //         v2 = new THREE.Vector3(fX2, fY2, 0),
        //         v3 = new THREE.Vector3(fX3, fY3, 0),
        //         v4 = new THREE.Vector3(fX4, fY4, 0);
        //     geometry.vertices.push(v1);
        //     geometry.vertices.push(v2);
        //     geometry.vertices.push(v3);
        //     geometry.vertices.push(v4);
        // }
        // for (let i = 0; i < (thetaSegments + 1); i++) {
        //     geometry.faces.push(new THREE.Face3(i * 4, i * 4 + 1, i * 4 + 2));
        //     geometry.faces.push(new THREE.Face3(i * 4, i * 4 + 2, i * 4 + 3));
        //     geometry.faceVertexUvs[0].push([
        //         new THREE.Vector2(0, 1),
        //         new THREE.Vector2(1, 1),
        //         new THREE.Vector2(1, 0)
        //     ]);
        //     geometry.faceVertexUvs[0].push([
        //         new THREE.Vector2(0, 1),
        //         new THREE.Vector2(1, 0),
        //         new THREE.Vector2(0, 0)
        //     ]);
        // }
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            opacity: 0,
            side: THREE.DoubleSide
        });
        
        this.ring = new THREE.Mesh(geometry, material);
        this.ring.position.set(0, 0, 0);
        this.ring.rotation.set(-Math.PI / 2 - Math.PI / 5, 0, 0);
        this.ring.castShadow = true;
        this.ring.receiveShadow = true;
    }
}
