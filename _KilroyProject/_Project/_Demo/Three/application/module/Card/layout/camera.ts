import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Layout from '../../../interface/layout';
import Global from '../../../constant/_global';

/**
 * 相机
 */
export default class Camera implements Layout {
    private controller: OrbitControls = null; // 控制器
    
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
            60, Global.FN.getDomAspect(), 1, 2000
        );
        this.instance.position.set(0, 0, 50);
        
        this.createController();
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
        
        this.controller.update();
        
        if (isResize) { // 屏幕变化
            this.instance.aspect = Global.FN.getDomAspect();
            this.instance.updateProjectionMatrix();
        }
    }
    
    /**
     * 创建控制器
     * @return {void}
     */
    private createController(): void {
        this.controller = new OrbitControls(this.instance, Global.Root as HTMLElement);
        this.controller.target = new THREE.Vector3(0, 0, 0);
        this.controller.enabled = true;
        this.controller.enableDamping = true;
        this.controller.enablePan = false;
        this.controller.enableKeys = false;
        this.controller.minPolarAngle = Math.PI * 0.1;
        this.controller.maxPolarAngle = Math.PI * 0.9;
        this.controller.minDistance = 10;
        this.controller.maxDistance = 300;
    }
}
