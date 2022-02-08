import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';

/**
 * 山脉
 */
export default class Mountain implements Component {
    private readonly name: string = 'Mountain-山脉';
    
    private scene: THREE.Scene = null; // 场景
    private texture: THREE.Texture = null; // 纹理
    
    private light: THREE.PointLight = null; // 灯光
    private simplex: SimplexNoise = null; // 单纯形
    private terrain: THREE.Mesh = null; // 地形
    private cycle: number = 0; // 周期
    private readonly moveP: any = { // 移动位置
        x: 0,
        y: -500,
        z: -6000
    };
    private readonly lookP: any = { // 视觉位置
        x: 0,
        y: 0,
        z: 0
    };
    
    public instance: THREE.Group = null; // 3D对象
    
    /**
     * 构造函数
     * @constructor Mountain
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
        this.instance.position.set(this.moveP.x, this.moveP.y, this.moveP.z);
        this.instance.rotation.set(this.lookP.x, this.lookP.y, this.lookP.z);
        
        this.createLight();
        this.createTerrain();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.instance.add(this.light);
        this.instance.add(this.terrain);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const ease = 15, // 缓冲系数
            moveS = 0.1, // 移动速度
            cycleS = 0.0008, // 周期速度
            factor = 1300, // 顶点系数（越大越平缓）
            scale = 300; // 陡峭倍数
        
        if (!this.instance) return;
        
        const geometry = this.terrain.geometry as any,
            position = geometry.attributes.position.array;
        for (let i = 0, n = position.length; i < n; i += 3) {
            const x = (position[i] / factor),
                y = (position[i + 1] / factor) + this.cycle;
            
            position[i + 2] = this.simplex.noise(x, y) * scale;
        }
        geometry.attributes.position.needsUpdate = true;
        
        this.cycle -= cycleS;
        
        this.moveP.x = -((Global.Focus.x - Global.FN.getDomCenter().x) * moveS);
        
        Global.FN.setEase(this.instance.position, this.moveP, ease);
        Global.FN.setEase(this.instance.rotation, this.lookP, ease);
    }
    
    /**
     * 创建光源
     */
    private createLight(): void {
        const color = new THREE.Color();
        color.setHSL(0.038, 0.8, 0.5);
        
        this.light = new THREE.PointLight('#ffffff', 1, 1000);
        this.light.color = color;
        this.light.castShadow = false;
        this.light.position.set(0, 500, 0);
    }
    
    /**
     * 创建地形
     */
    private createTerrain(): void {
        this.texture.wrapT
            = this.texture.wrapS
            = THREE.RepeatWrapping;
        
        this.simplex = new SimplexNoise();
        
        const geometry = new THREE.PlaneGeometry(
            12000, 1400, 128, 32
        );
        
        const material = new THREE.MeshPhongMaterial({ // 材料
            color: '#ffffff',
            opacity: 1,
            map: this.texture,
            blending: THREE.NoBlending,
            side: THREE.BackSide,
            transparent: false,
            depthTest: true
        });
        
        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.position.set(0, 0, 0);
        this.terrain.rotation.set((Math.PI / 2) + 0.8, 0, 0);
    }
}
