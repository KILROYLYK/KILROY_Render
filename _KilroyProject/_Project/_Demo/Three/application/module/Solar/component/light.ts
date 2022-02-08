import * as THREE from 'three';

import Component from '../../../interface/component';

/**
 * 光源
 */
export default class Light implements Component {
    private readonly name: string = 'Light-光源';
    
    private scene: THREE.Scene = null; // 场景
    
    private lightAmbient: THREE.AmbientLight = null; // 环境光源
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Light
     * @param {*} scene 场景
     */
    constructor(scene: any) {
        this.scene = scene.instance;
        
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
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.instance.add(this.lightAmbient);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        if (!this.instance) return;
    }
    
    /**
     * 创建光源
     */
    private createLight(): void {
        this.lightAmbient = new THREE.AmbientLight('#ffffff', 0.1);
        this.lightAmbient.position.set(0, 0, 0);
    }
}
