import * as THREE from 'three';

import Component from '../../../interface/component';

/**
 * 地面
 */
export default class Ground implements Component {
    private readonly name: string = 'Ground-地面';
    
    private scene: THREE.Scene = null; // 场景
    
    private readonly radius: number = 1000; // 半径
    
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
     * @return {void}
     */
    private create(): void {
        const matrix = new THREE.Matrix4();
        
        const geometry = new THREE.CylinderGeometry(
            this.radius, this.radius, 1400,
            40, 10
        );
        geometry.applyMatrix4(matrix.makeRotationX(-Math.PI / 2));
        
        const material = new THREE.MeshPhongMaterial({
            color: '#27c433',
            flatShading: true
        });
        
        this.instance = new THREE.Mesh(geometry, material);
        this.instance.name = this.name;
        this.instance.position.set(0, 0, 0);
        this.instance.castShadow = false;
        this.instance.receiveShadow = true;
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     * @return {void}
     */
    public update(): void {
        if (!this.instance) return;
        
        this.instance.rotateZ(0.003);
    }
}
