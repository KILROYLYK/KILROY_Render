import * as THREE from 'three';

import Layout from '../../../interface/layout';
import Global from '../../../constant/_global';

/**
 * 相机
 */
export default class Camera implements Layout {
    public instance: THREE.PerspectiveCamera = null; // 实例
    
    /**
     * 构造函数
     * @constructor Camera
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
        this.instance = new THREE.PerspectiveCamera(
            60, Global.FN.getDomAspect(), 1, 1500
        );
        this.instance.position.set(0, 0, 0);
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
    }
    
    /**
     * 更新
     * @param {boolean} isResize 屏幕是否变化
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        if (!this.instance) return;
        
        if (isResize) { // 屏幕变化
            this.instance.aspect = Global.FN.getDomAspect();
            this.instance.updateProjectionMatrix();
        }
    }
}
