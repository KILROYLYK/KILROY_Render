import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Global from '../../../constant/_global';
import Layout from '../../../interface/layout';

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
        const _this = this;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        const _this = this;
        
        _this.instance = new THREE.PerspectiveCamera(
            60, Global.Function.getDomAspect(), 1, 2000
        );
        _this.instance.position.set(0, 0, 50);
        
        _this.createController();
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        const _this = this;
    }
    
    /**
     * 更新
     * @param {boolean} isResize 屏幕是否变化
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.instance) return;
        
        _this.controller.update();
        
        if (isResize) { // 屏幕变化
            _this.instance.aspect = Global.Function.getDomAspect();
            _this.instance.updateProjectionMatrix();
        }
    }
    
    /**
     * 创建控制器
     * @return {void}
     */
    private createController(): void {
        const _this = this;
        
        _this.controller = new OrbitControls(_this.instance, Global.$Root[0]);
        _this.controller.target = new THREE.Vector3(0, 0, 0);
        _this.controller.enabled = true;
        _this.controller.enableDamping = true;
        _this.controller.enablePan = false;
        _this.controller.enableKeys = false;
        _this.controller.minPolarAngle = Math.PI * 0.1;
        _this.controller.maxPolarAngle = Math.PI * 0.9;
        _this.controller.minDistance = 10;
        _this.controller.maxDistance = 300;
    }
}