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
        const _this = this;
        
        _this.scene = scene.instance;
        
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
        _this.instance.position.set(0, 0, 0);
        
        _this.createLight();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.instance.add(_this.lightAmbient);
        _this.scene.add(_this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const _this = this;
        
        if (!_this.instance) return;
    }
    
    /**
     * 创建光源
     */
    private createLight(): void {
        const _this = this;
        
        _this.lightAmbient = new THREE.AmbientLight('#ffffff', 0.1);
        _this.lightAmbient.position.set(0, 0, 0);
    }
}
