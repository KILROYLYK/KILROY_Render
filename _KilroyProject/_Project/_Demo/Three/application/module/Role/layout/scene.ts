import * as THREE from 'three';

import Layout from '../../../interface/layout';

/**
 * 场景
 */
export default class Scene implements Layout {
    public instance: THREE.Scene = null; // 实例
    
    /**
     * 构造函数
     * @constructor Scene
     */
    constructor() {
        const _this = this;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const _this = this;
        
        _this.instance = new THREE.Scene();
        _this.instance.background = new THREE.Color('#222222');
        _this.instance.fog = new THREE.FogExp2('#ffffff', 0.0001);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
    }
}
