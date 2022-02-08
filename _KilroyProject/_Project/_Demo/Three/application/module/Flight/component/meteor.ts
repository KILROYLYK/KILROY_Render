import * as THREE from 'three';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';

/**
 * 流星
 */
export default class Meteor implements Component {
    private readonly name: string = 'Meteor-流星';
    
    private scene: THREE.Scene = null; // 场景
    
    public star: THREE.Mesh[] = []; // 流星列表
    private readonly moveP: any = { // 移动位置
        x: 0,
        y: 300,
        z: 200
    };
    private readonly lookP: any = { // 视觉位置
        x: 0,
        y: 0,
        z: 0
    };
    
    public instance: THREE.Group = null; // 实例
    
    
    /**
     * 构造函数
     * @constructor Meteor
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
        this.instance.position.set(this.moveP.x, this.moveP.y, this.moveP.z);
        this.instance.rotation.set(this.lookP.x, this.lookP.y, this.lookP.z);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const ease = 15, // 缓冲系数
            mouseS = 0.1; // 鼠标速度
        
        if (!this.instance) return;
        
        Math.random() > 0.95 && this.createStar();
        
        this.star.forEach((v: THREE.Mesh, i: number, a: THREE.Mesh[]) => {
            if (v.position.z < -3000) {
                this.star.splice(i, 1);
                this.instance.remove(v);
            }
            v.position.z -= 20;
        });
        
        this.moveP.x = -((Global.Focus.x - Global.FN.getDomCenter().x) * mouseS);
        
        Global.FN.setEase(this.instance.position, this.moveP, ease);
        Global.FN.setEase(this.instance.rotation, this.lookP, ease);
    }
    
    /**
     * 创建星星
     */
    private createStar(): void {
        const spread = 1000; // 扩散范围
        
        const random = THREE.MathUtils.randInt(-spread, spread); // 随机整数
        
        const geometry = new THREE.CylinderGeometry( // 几何体
            0, 2, 120, 10
        );
        
        const material = new THREE.MeshBasicMaterial({ // 材质
            color: '#ffffff',
            opacity: 1,
            blending: THREE.AdditiveBlending,
            side: THREE.FrontSide,
            transparent: true,
            depthTest: true
        });
        
        const cylinder = new THREE.Mesh(geometry, material); // 圆柱
        cylinder.position.set(random, 0, 0);
        cylinder.rotation.set(Math.PI / 2, 0, 0);
        
        this.star.push(cylinder);
        this.instance.add(cylinder);
    }
}
