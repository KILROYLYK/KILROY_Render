import * as THREE from 'three';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';

/**
 * 云
 */
export default class Cloud implements Component {
    public readonly name: string = 'Cloud-云';
    
    private scene: THREE.Scene = null; // 场景
    
    private readonly radius: number = 20; // 半径
    private readonly range: number = 0.2; // 范围
    private geometry: THREE.DodecahedronGeometry = null; // 几何
    private material: THREE.MeshPhongMaterial = null; // 纹理
    private cloud: {
        cycle: number,
        y: number,
        mesh: THREE.Mesh
    }[] = []; // 云
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Cloud
     * @param {*} scene 场景
     */
    constructor(scene: any) {
        // this.scene = scene.instance;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    public create(): void {
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, 0, 0);
        
        this.geometry = new THREE.DodecahedronGeometry(this.radius, 0);
        this.material = new THREE.MeshPhongMaterial({
            color: '#d8d0d1'
        });
    }
    
    /**
     * 初始化
     */
    public init(): void {
        // this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const cycleS = 0.0015; // 周期速度
        
        if (Math.random() > 0.98) this.createCloud();
        
        this.cloud = this.cloud.filter((v, i, a) => {
            v.cycle += cycleS;
            v.mesh.position.x = Math.cos(v.cycle) * v.y;
            v.mesh.position.y = Math.sin(v.cycle) * v.y;
            v.mesh.rotateX(cycleS);
            v.mesh.rotateY(-cycleS);
            v.mesh.rotateZ(cycleS);
            
            return v.cycle < Math.PI * (1 - this.range);
        });
    }
    
    /**
     * 创建云朵
     */
    private createCloud(): void {
        const track = 1000, // 轨道
            range = 350, // 范围
            n = Global.Function.Calc.random(1, 4),
            y = Global.Function.Calc.random(track + 150, track + 300),
            z = Global.Function.Calc.random(-range, range);
        
        let cycle = Math.PI * this.range; // 周期
        
        for (let i = 0; i < n; i++) {
            const scale = Global.Function.Calc.random(2, 9) * 0.1,
                radius = scale * this.radius * 0.8 / y;
            
            if (i !== 0) cycle += radius;
            
            // const cloud = new THREE.Mesh(this.geometry, this.material);
            // cloud.position.set(0, y, z);
            // cloud.rotation.x = Math.random() * Math.PI * 2;
            // cloud.rotation.y = Math.random() * Math.PI * 2;
            // cloud.rotation.z = Math.random() * Math.PI * 2;
            // cloud.scale.setScalar(scale);
            // cloud.castShadow = true;
            // this.cloud.push({
            //     cycle, y,
            //     mesh: cloud
            // });
            // this.instance.add(cloud);
            
            cycle += radius;
        }
    }
}
