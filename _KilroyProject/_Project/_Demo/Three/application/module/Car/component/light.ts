import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';

import Component from '../../../interface/component';

/**
 * 光源
 */
export default class Light implements Component {
    private readonly name: string = 'Light-光源';
    
    private scene: THREE.Scene = null; // 场景
    
    private lightAmbient: THREE.AmbientLight = null; // 环境光源
    private lightDirectional: THREE.DirectionalLight = null; // 定向光源
    private lightArea1: THREE.Group = null; // 区域光源1
    private lightArea2: THREE.Group = null; // 区域光源2
    private lightArea3: THREE.Group = null; // 区域光源3
    private lightArea4: THREE.Group = null; // 区域光源4
    
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
        this.createArea();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        RectAreaLightUniformsLib.init();
        
        this.instance.add(this.lightAmbient);
        this.instance.add(this.lightDirectional);
        this.instance.add(this.lightArea1);
        this.instance.add(this.lightArea2);
        this.instance.add(this.lightArea3);
        this.instance.add(this.lightArea4);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        if (!this.instance) return;
        
        this.instance.rotateY(0.002);
    }
    
    /**
     * 创建光源
     */
    private createLight(): void {
        const color = '#ffffff',
            distance = 500,
            size = 2048,
            lightH = 40,
            lightD = 120;
        
        this.lightAmbient = new THREE.AmbientLight(color, 0.1);
        
        this.lightDirectional = new THREE.DirectionalLight(color, 0.5);
        this.lightDirectional.position.set(0, 1, 0);
        this.lightDirectional.position.multiplyScalar(30);
        this.lightDirectional.castShadow = true;
        this.lightDirectional.shadow.camera.top = distance;
        this.lightDirectional.shadow.camera.left = -distance;
        this.lightDirectional.shadow.camera.right = distance;
        this.lightDirectional.shadow.camera.bottom = -distance;
        this.lightDirectional.shadow.camera.far = 2000;
        this.lightDirectional.shadow.mapSize.width = size;
        this.lightDirectional.shadow.mapSize.height = size;
        
        this.lightArea1 = new THREE.Group();
        this.lightArea1.position.set(lightD, lightH, 0);
        this.lightArea1.rotation.set(0, Math.PI / 2, 0);
        
        this.lightArea2 = new THREE.Group();
        this.lightArea2.position.set(-lightD, lightH, 0);
        this.lightArea2.rotation.set(0, -Math.PI / 2, 0);
        
        this.lightArea3 = new THREE.Group();
        this.lightArea3.position.set(0, lightH, lightD);
        this.lightArea3.rotation.set(0, 0, 0);
        
        this.lightArea4 = new THREE.Group();
        this.lightArea4.position.set(0, lightH, -lightD);
        this.lightArea4.rotation.set(0, Math.PI, 0);
    }
    
    /**
     * 创建区域
     */
    private createArea(): void {
        const light1 = new THREE.RectAreaLight(
            0xffffff, 10, 50, 50
        );
        
        const mesh1 = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new THREE.MeshBasicMaterial({
                side: THREE.BackSide
            })
        );
        mesh1.scale.x = light1.width;
        mesh1.scale.y = light1.height;
        
        light1.add(mesh1);
        this.lightArea1.add(light1);
        
        const light2 = new THREE.RectAreaLight(
            0xffffff, 10, 50, 50
        );
        
        const mesh2 = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new THREE.MeshBasicMaterial({
                side: THREE.BackSide
            })
        );
        mesh2.scale.x = light2.width;
        mesh2.scale.y = light2.height;
        
        light2.add(mesh2);
        this.lightArea2.add(light2);
        
        const light3 = new THREE.RectAreaLight(
            0xffffff, 10, 50, 50
        );
        
        const mesh3 = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new THREE.MeshBasicMaterial({
                side: THREE.BackSide
            })
        );
        mesh3.scale.x = light3.width;
        mesh3.scale.y = light3.height;
        
        light3.add(mesh3);
        this.lightArea3.add(light3);
        
        const light4 = new THREE.RectAreaLight(
            0xffffff, 10, 50, 50
        );
        
        const mesh4 = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new THREE.MeshBasicMaterial({
                side: THREE.BackSide
            })
        );
        mesh4.scale.x = light4.width;
        mesh4.scale.y = light4.height;
        
        light4.add(mesh4);
        this.lightArea4.add(light4);
    }
}
