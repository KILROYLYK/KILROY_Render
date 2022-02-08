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
        this.create();
        this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        const color = '#222222';
        
        this.instance = new THREE.Scene();
        this.instance.background = new THREE.Color(color);
        // this.instance.fog = new THREE.FogExp2(color, 0.0003);
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
    }
}
