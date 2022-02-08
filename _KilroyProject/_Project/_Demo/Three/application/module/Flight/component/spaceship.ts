import * as THREE from 'three';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';

export interface Texture { // 纹理
    spaceship: THREE.Object3D // 飞船
    engine: THREE.Texture // 引擎
}

/**
 * 飞船
 */
export default class Spaceship implements Component {
    private readonly name: string = 'Spaceship-飞船';
    
    private scene: THREE.Scene = null; // 场景
    private texture: Texture = { // 纹理
        spaceship: null, // 飞船
        engine: null // 引擎
    };
    
    private light: THREE.PointLight = null; // 灯光
    private spaceship: THREE.Object3D = null; // 飞船
    private fire: THREE.Mesh = null; // 火焰
    private bullet: THREE.Mesh[] = []; // 子弹列表
    private readonly moveP: any = { // 移动位置
        x: 0,
        y: 0,
        z: 0
    };
    private readonly lookP: any = { // 视觉位置
        x: 0,
        y: 0,
        z: 0
    };
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Spaceship
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
        this.instance.position.set(this.moveP.x, this.moveP.y, this.moveP.z);
        this.instance.rotation.set(this.lookP.x, this.lookP.y, this.lookP.z);
        
        this.createLight();
        this.createSpaceship();
        this.createEngine();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.instance.add(this.light);
        this.instance.add(this.spaceship);
        this.instance.add(this.fire);
        this.scene.add(this.instance);
        
        addEventListener('wheel', (e: WheelEvent) => {
            const z = this.moveP.z;
            let d = z + (e.deltaY | 0);
            d = (d < -20) ? -20 : d;
            d = (d > 20) ? 20 : d;
            this.moveP.z = d;
        });
        addEventListener('click', (e: MouseEvent) => {
            this.createBullet();
        });
    }
    
    /**
     * 更新
     */
    public update(): void {
        const ease = 12, // 缓冲系数
            moveS = { // 移动速度
                x: 0.07,
                y: 0.06
            },
            lookS = 0.0004, // 视觉速度
            centerP = Global.FN.getDomCenter(); // 中心位置
        
        if (!this.instance) return;
        
        this.texture.engine.offset.y -= 0.06;
        
        this.moveP.x = (Global.Focus.x - centerP.x) * moveS.x;
        this.moveP.y = -((Global.Focus.y - centerP.y) * moveS.y) - 4;
        this.lookP.z = (Global.Focus.x - centerP.x) * lookS;
        
        Global.FN.setEase(this.instance.position, this.moveP, ease);
        Global.FN.setEase(this.instance.rotation, this.lookP, ease);
        
        // 更新子弹
        this.bullet.forEach((v: THREE.Mesh, i: number, a: THREE.Mesh[]) => {
            const cylinder = this.bullet[i];
            if (cylinder.position.z < -300) {
                this.bullet.splice(i, 1);
                this.scene.remove(cylinder);
            }
            cylinder.position.z -= 6;
        });
    }
    
    /**
     * 创建光源
     */
    private createLight(): void {
        this.light = new THREE.PointLight('#ffffff', 15, 300);
        this.light.position.set(0, 100, 0);
    }
    
    /**
     * 创建飞船
     */
    private createSpaceship(): void {
        this.spaceship = this.texture.spaceship;
        this.spaceship.position.set(0, 0, 250);
        this.spaceship.rotation.set(0, Math.PI, 0);
    }
    
    /**
     * 创建引擎
     */
    private createEngine(): void {
        const engine = this.texture.engine;
        
        engine.wrapT
            = engine.wrapS
            = THREE.RepeatWrapping;
        
        const material = new THREE.MeshBasicMaterial({
            color: '#0099ff',
            opacity: 1,
            alphaMap: engine,
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide,
            transparent: true,
            depthTest: true
        });
        
        this.fire = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0, 0.4, 10,
                32, 32, true
            ), material
        );
        this.fire.position.set(0, 0.4, 257);
        this.fire.rotation.set(Math.PI / 2, 0, 0);
    }
    
    /**
     * 创建子弹
     */
    private createBullet(): void {
        const position = this.instance.position;
        
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1, .5);
        
        const geometry = new THREE.CylinderGeometry(
            .3, 0, 20, 10
        );
        
        const material = new THREE.MeshBasicMaterial({
            color,
            opacity: .8,
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide,
            transparent: true,
            depthTest: true
        });
        
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set(position.x, position.y, position.z + 250);
        cylinder.rotation.set(11, 0, 0);
        
        this.bullet.push(cylinder);
        this.scene.add(cylinder);
    }
}
