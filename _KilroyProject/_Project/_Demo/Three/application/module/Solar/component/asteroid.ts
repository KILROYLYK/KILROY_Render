import * as THREE from 'three';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';
import Stage from '../stage';

/**
 * 小行星
 */
export default class Asteroid implements Component {
    private readonly name: string = 'Asteroid-小行星';
    
    private scene: THREE.Scene = null; // 场景
    private texture: THREE.Texture = null; // 纹理
    
    private readonly radius: number = Stage.trackM * 6; // 半径
    private readonly trackR: number = Stage.trackIR + Stage.trackM * 5; // 轨迹半径
    private pointB: THREE.Points = null; // 宽星带
    private pointS: THREE.Points = null; // 窄星带
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Asteroid
     * @param {*} scene 场景
     * @param {THREE.Texture} texture 纹理
     */
    constructor(scene: any, texture: THREE.Texture) {
        this.scene = scene.instance;
        this.texture = texture;
        
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
        
        this.createPoint();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.instance.add(this.pointB);
        this.instance.add(this.pointS);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const cycleS = 0.001; // 周期速度
        
        if (!this.instance) return;
        
        this.pointB.rotateY(cycleS);
        this.pointS.rotateY(cycleS * 2);
    }
    
    /**
     * 创建点
     */
    private createPoint(): void {
        const d = Stage.trackM;
        
        const pointB = this.getPoint(this.trackR, this.trackR + this.radius) as any,
            pointS = this.getPoint(this.trackR + d, this.trackR + this.radius - d) as any;
        
        this.pointB = new THREE.Points(pointB.geometry, pointB.material);
        this.pointS = new THREE.Points(pointS.geometry, pointS.material);
    }
    
    /**
     * 获取位置
     * @param {number} min 最小半径
     * @param {number} max 最大半径
     * @return {*} 坐标
     */
    private getPosition(min: number, max: number): any {
        const position = {
                x: Global.Function.Calc.random(-max, max),
                z: Global.Function.Calc.random(-max, max)
            },
            x = Math.pow(position.x, 2),
            z = Math.pow(position.z, 2),
            d = Math.sqrt(x + z);
        
        if (d > max || d < min) return this.getPosition(min, max);
        
        return position;
    }
    
    /**
     * 生成点
     * @param {number} min 最小半径
     * @param {number} max 最大半径
     * @return {*} 点阵
     */
    private getPoint(min: number, max: number): any {
        const total = 5000,
            point = [];
        
        for (let i = 0; i < total; i++) {
            const position = this.getPosition(min, max);
            point.push(position.x, 0, position.z);
        }
        
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(point, 3));
        
        const material = new THREE.PointsMaterial({
            map: this.texture,
            size: 5,
            sizeAttenuation: true,
            transparent: true
        });
        
        return {
            geometry,
            material
        };
    }
}
