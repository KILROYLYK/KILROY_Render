import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

import Global from '../../../../../1/_global';
import Component from '../../../interface/component';

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
        const _this = this;
        
        _this.scene = scene.instance;
        _this.texture = texture;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const _this = this;
        
        _this.instance = new THREE.Group();
        _this.instance.name = _this.name;
        _this.instance.position.set(_this.moveP.x, _this.moveP.y, _this.moveP.z);
        _this.instance.rotation.set(_this.lookP.x, _this.lookP.y, _this.lookP.z);
        
        _this.createLight();
        _this.createTerrain();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.instance.add(_this.light);
        _this.instance.add(_this.terrain);
        _this.scene.add(_this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const _this = this,
            ease = 15, // 缓冲系数
            moveS = 0.1, // 移动速度
            cycleS = 0.0008, // 周期速度
            factor = 1300, // 顶点系数（越大越平缓）
            scale = 300; // 陡峭倍数
        
        if (!_this.instance) return;
        
        const geometry = _this.terrain.geometry as any,
            position = geometry.attributes.position.array;
        for (let i = 0, n = position.length; i < n; i += 3) {
            const x = (position[i] / factor),
                y = (position[i + 1] / factor) + _this.cycle;
            
            position[i + 2] = _this.simplex.noise(x, y) * scale;
        }
        geometry.attributes.position.needsUpdate = true;
        
        _this.cycle -= cycleS;
        
        _this.moveP.x = -((Global.Focus.x - Global.Function.getDomCenter().x) * moveS);
        
        Global.Function.setEase(_this.instance.position, _this.moveP, ease);
        Global.Function.setEase(_this.instance.rotation, _this.lookP, ease);
    }
    
    /**
     * 创建光源
     */
    private createLight(): void {
        const _this = this;
        
        const color = new THREE.Color();
        color.setHSL(0.038, 0.8, 0.5);
        
        _this.light = new THREE.PointLight('#ffffff', 1, 1000);
        _this.light.color = color;
        _this.light.castShadow = false;
        _this.light.position.set(0, 500, 0);
    }
    
    /**
     * 创建地形
     */
    private createTerrain(): void {
        const _this = this;
        
        _this.texture.wrapT
            = _this.texture.wrapS
            = THREE.RepeatWrapping;
        
        _this.simplex = new SimplexNoise();
        
        const geometry = new THREE.PlaneGeometry(
            12000, 1400, 128, 32
        );
        
        const material = new THREE.MeshPhongMaterial({ // 材料
            color: '#ffffff',
            opacity: 1,
            map: _this.texture,
            blending: THREE.NoBlending,
            side: THREE.BackSide,
            transparent: false,
            depthTest: true
        });
        
        _this.terrain = new THREE.Mesh(geometry, material);
        _this.terrain.position.set(0, 0, 0);
        _this.terrain.rotation.set((Math.PI / 2) + 0.8, 0, 0);
    }
}
