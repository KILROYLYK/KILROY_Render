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
     */
    private create(): void {
        this.instance = new THREE.Scene();
    }
    
    /**
     * 初始化
     */
    private init(): void {
    }
}
