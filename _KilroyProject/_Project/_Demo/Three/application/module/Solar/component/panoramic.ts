import * as THREE from 'three';

import Component from '../../../interface/component';

/**
 * 全景
 */
export default class Panoramic implements Component {
    private readonly name: string = 'Panoramic-全景';
    
    private scene: THREE.Scene = null; // 场景
    private texture: THREE.Texture = null; // 纹理
    
    public instance: THREE.Mesh = null; // 实例
    
    /**
     * 原型对象
     * @constructor Panoramic
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
        
        // 球型几何体
        const geometry = new THREE.SphereGeometry(
            18000, 64, 64
        );
        geometry.scale(-1, 1, 1);
        geometry.rotateY(-Math.PI / 2); // 视角平行
        
        // 材料
        const material = new THREE.MeshBasicMaterial({
            map: _this.texture
        });
        
        _this.instance = new THREE.Mesh(geometry, material);
        _this.instance.castShadow = false;
        _this.instance.receiveShadow = false;
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.scene.add(_this.instance);
    }
}
