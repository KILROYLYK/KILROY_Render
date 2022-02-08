import * as THREE from 'three';

import Global from '../../../../../1/_global';
import Component from '../../../interface/component';

/**
 * 星星
 */
export default class Star implements Component {
    private readonly name: string = 'Star-星星';
    
    private scene: THREE.Scene = null; // 场景
    private texture: THREE.Texture = null; // 纹理
    
    private readonly moveP: any = { // 移动位置
        x: 0,
        y: 1200,
        z: -1000
    };
    private readonly lookP: any = { // 视觉位置
        x: 0,
        y: 0,
        z: 0
    };
    
    public instance: THREE.Points = null; // 实例
    
    /**
     * 构造函数
     * @constructor Star
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
     * @return {void}
     */
    private create(): void {
        const _this = this,
            spread = 8000; // 扩散范围
        
        const geometry = new THREE.BoxGeometry() as any,
            position = [];
        for (let i = 0; i < 400; i++) {
            const angle = (Math.random() * Math.PI * 2),
                radius = THREE.MathUtils.randInt(0, spread);
            
            position.push(Math.cos(angle) * radius);
            position.push(Math.sin(angle) * radius / 10);
            position.push(THREE.MathUtils.randInt(-spread, 0));
        }
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));
        geometry.attributes.position.needsUpdate = true;
        
        const material = new THREE.PointsMaterial({ // 点材质
            size: 64,
            color: '#ffffff',
            opacity: 1,
            map: _this.texture,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        _this.instance = new THREE.Points(geometry, material);
        _this.instance.name = _this.name;
        _this.instance.position.set(_this.moveP.x, _this.moveP.y, _this.moveP.z);
        _this.instance.rotation.set(_this.lookP.x, _this.lookP.y, _this.lookP.z);
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        const _this = this;
        
        _this.scene.add(_this.instance);
    }
    
    /**
     * 更新
     * @return {void}
     */
    public update(): void {
        const _this = this,
            ease = 15, // 缓冲系数
            mouseS = 0.1; // 鼠标速度
        
        if (!_this.instance) return;
        
        _this.moveP.x = -((Global.Focus.x - Global.Function.getDomCenter().x) * mouseS);
        
        Global.Function.setEase(_this.instance.position, _this.moveP, ease);
        Global.Function.setEase(_this.instance.rotation, _this.lookP, ease);
    }
}
