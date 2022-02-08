import * as THREE from 'three';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';

/**
 * 地面
 */
export default class Ground implements Component {
    private readonly name: string = 'Ground-地面';
    
    private scene: THREE.Scene = null; // 场景
    
    private light: THREE.PointLight = null; // 灯光
    private simplex: SimplexNoise = null; // 单纯形
    private plane: THREE.Mesh = null; // 平原
    private cycle: number = 0; // 周期
    private readonly moveP: any = { // 移动位置
        x: 0,
        y: -350,
        z: -1000
    };
    private readonly lookP: any = { // 视觉位置
        x: Math.PI / 2,
        y: 0,
        z: 0
    };
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Ground
     * @param {*} scene 场景
     */
    constructor(scene: any) {
        this.scene = scene.instance;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(this.moveP.x, this.moveP.y, this.moveP.z);
        this.instance.rotation.set(this.lookP.x, this.lookP.y, this.lookP.z);
        
        this.createLight();
        this.createPlane();
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.instance.add(this.light);
        this.instance.add(this.plane);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     * @return {void}
     */
    public update(): void {
        const ease = 15, // 缓冲系数
            factor = 300, // 顶点系数（越大越平缓）
            scale = 40, // 陡峭倍数
            cycleS = 0.08, // 周期速度
            mouseS = 0.5; // 鼠标速度
        
        if (!this.instance) return;
        
        const geometry = this.plane.geometry as any,
            position = geometry.attributes.position.array;
        for (let i = 0, n = position.length; i < n; i += 3) {
            const x = (position[i] / factor),
                y = (position[i + 1] / factor) + this.cycle;
            
            position[i + 2] = this.simplex.noise(x, y) * scale;
        }
        geometry.attributes.position.needsUpdate = true;
        
        this.cycle -= cycleS;
        
        this.moveP.x = -((Global.Focus.x - Global.FN.getDomCenter().x) * mouseS);
        
        Global.FN.setEase(this.instance.position, this.moveP, ease);
        Global.FN.setEase(this.instance.rotation, this.lookP, ease);
    }
    
    /**
     * 创建光源
     * @return {void}
     */
    private createLight(): void {
        const color = new THREE.Color();
        color.setHSL(0.038, 0.8, 0.5);
        
        this.light = new THREE.PointLight('#ffffff', 3, 800);
        this.light.color = color;
        this.light.castShadow = false;
        this.light.position.set(0, 50, 500);
    }
    
    /**
     * 创建平面
     * @return {void}
     */
    private createPlane(): void {
        this.simplex = new SimplexNoise();
        
        const geometry = new THREE.PlaneGeometry(
            4000, 2000, 128, 64
        );
        
        const material = new THREE.MeshLambertMaterial({
            color: '#ffffff',
            blending: THREE.NoBlending,
            side: THREE.FrontSide,
            transparent: false,
            depthTest: true,
            wireframe: true
        });
        
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.position.set(0, 0, 0);
        this.plane.rotation.set(0, 0, 0);
    }
}
