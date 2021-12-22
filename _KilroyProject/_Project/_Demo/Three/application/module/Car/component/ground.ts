import * as THREE from 'three';

import Component from '../../../interface/component';

/**
 * 地面
 */
export default class Ground implements Component {
    private readonly name: string = 'Ground-地面';
    
    private scene: THREE.Scene = null; // 场景
    
    public instance: THREE.Mesh = null; // 实例
    
    /**
     * 构造函数
     * @constructor Ground
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
        
        const geometry = new THREE.RingGeometry(
            0, 1000, 32
        );
        
        const material = new THREE.MeshLambertMaterial({
            color: '#111111',
            transparent: true,
            opacity: 1
        });
        
        _this.instance = new THREE.Mesh(geometry, material);
        _this.instance.name = _this.name;
        _this.instance.position.set(0, 0, 0);
        _this.instance.rotation.set(-Math.PI / 2, 0, 0);
        _this.instance.castShadow = true;
        _this.instance.receiveShadow = true;
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.scene.add(_this.instance);
    }
}
