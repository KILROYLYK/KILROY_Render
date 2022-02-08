import * as THREE from 'three';

import Component from '../../../interface/component';

/**
 * 光源
 */
export default class Light implements Component {
    private readonly name: string = 'Light-光源';
    
    private scene: THREE.Scene = null; // 场景
    
    private lightAmbient: THREE.AmbientLight = null; // 环境光源
    private lightDirectional: THREE.DirectionalLight = null; // 定向光源
    
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
     * @return {void}
     */
    private create(): void {
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, 0, 0);
        
        this.createLight();
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.instance.add(this.lightAmbient);
        this.instance.add(this.lightDirectional);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     * @return {void}
     */
    public update(): void {
        if (!this.instance) return;
    }
    
    /**
     * 创建光源
     * @return {void}
     */
    private createLight(): void {
        const distance = 1000,
            size = 2048;
        
        this.lightAmbient = new THREE.AmbientLight('#ffffff', 0.1);
        this.lightAmbient.position.set(0, 0, 0);
        
        this.lightDirectional = new THREE.DirectionalLight('#ffffff', 1.5);
        this.lightDirectional.position.set(0, 1500, 400);
        this.lightDirectional.castShadow = true;
        this.lightDirectional.shadow.camera.top = distance;
        this.lightDirectional.shadow.camera.left = -distance;
        this.lightDirectional.shadow.camera.right = distance;
        this.lightDirectional.shadow.camera.bottom = -distance;
        this.lightDirectional.shadow.camera.far = 2000;
        this.lightDirectional.shadow.mapSize.width = size;
        this.lightDirectional.shadow.mapSize.height = size;
    }
}
