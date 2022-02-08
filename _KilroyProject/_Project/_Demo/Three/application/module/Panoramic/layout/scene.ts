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
        this.instance = new THREE.Scene();
        this.instance.background = new THREE.Color('#222222');
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
    }
}
