import * as THREE from 'three';

import Component from '../../../interface/component';

export interface Texture { // 纹理
    image: THREE.Texture // 图片
    cube: THREE.CubeTexture // 图组
}

/**
 * 全景
 */
export default class Panoramic implements Component {
    private readonly name: string = 'Panoramic-全景';
    
    private scene: THREE.Scene = null; // 场景
    private texture: Texture = null; // 纹理
    
    public instance: THREE.Mesh = null; // 实例
    
    /**
     * 原型对象
     * @constructor Panoramic
     * @param {*} scene 场景
     * @param {Texture} texture 纹理
     */
    constructor(scene: any, texture: Texture) {
        this.scene = scene.instance;
        this.texture = texture;
        
        // this.scene.background = this.texture.cube;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        const image = this.texture.image,
            cube = this.texture.cube;
        
        // 球型几何体
        const geometry = new THREE.SphereGeometry(
            1500, 64, 64
        );
        geometry.scale(-1, 1, 1);
        geometry.rotateY(-Math.PI / 2); // 视角平行
        
        // 材料
        const material = new THREE.MeshBasicMaterial({
            map: image
        });
        
        this.instance = new THREE.Mesh(geometry, material);
        this.instance.name = this.name;
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.scene.add(this.instance);
    }
}
