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
        this.scene = scene.instance;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const geometry = new THREE.RingGeometry(
            0, 1000, 32
        );
        
        const material = new THREE.MeshLambertMaterial({
            color: '#111111',
            transparent: true,
            opacity: 1
        });
        
        this.instance = new THREE.Mesh(geometry, material);
        this.instance.name = this.name;
        this.instance.position.set(0, 0, 0);
        this.instance.rotation.set(-Math.PI / 2, 0, 0);
        this.instance.castShadow = true;
        this.instance.receiveShadow = true;
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.scene.add(this.instance);
    }
}
