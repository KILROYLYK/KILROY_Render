import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// @ts-ignore
import { Tween, Easing } from '/usr/local/lib/node_modules/@tweenjs/tween.js'; // 动效

import Global from '../../../../../1/_global';
import Layout from '../../../interface/layout';

/**
 * 相机
 */
export default class Camera implements Layout {
    private controller: OrbitControls = null; // 控制器
    
    private setTime: number = 0; // 定时器
    
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
            60, Global.Function.getDomAspect(), 1, 40000
        );
        _this.instance.position.set(0, 20000, 0);
        
        _this.createController();
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        const _this = this;
        
        _this.switchPosition();
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
        _this.controller.enabled = false;
    }
    
    /**
     * 切换位置
     * @return {void}
     */
    private switchPosition(): void {
        const _this = this;
        
        const tween = new Tween(_this.instance.position)
            .easing(Easing.Cubic.InOut)
            .delay(5000)
            .to({
                x: 0,
                y: 500,
                z: 5000
            }, 3000)
            .onComplete(() => {
                tween.stop();
                _this.openRotate();
                _this.openController();
            })
            .onStop(() => {
                Global.W.addEventListener('mousedown', () => {
                    _this.setTime && clearTimeout(_this.setTime);
                    _this.closeRotate();
                }, false);
                Global.W.addEventListener('mouseup', () => {
                    _this.setTime = setTimeout(() => {
                        _this.openRotate();
                    }, 10000);
                }, false);
            })
            .start();
    }
    
    /**
     * 开启控制器
     * @return {void}
     */
    private openController(): void {
        const _this = this;
        
        _this.controller.enabled = true;
        _this.controller.enableDamping = true;
        _this.controller.enablePan = false;
        _this.controller.enableKeys = false;
        _this.controller.minPolarAngle = Math.PI * 0.3;
        _this.controller.maxPolarAngle = Math.PI * 0.7;
        _this.controller.minDistance = 500;
        _this.controller.maxDistance = 20000;
        _this.controller.autoRotateSpeed = 0.2;
    }
    
    /**
     * 开启自动旋转
     * @return {void}
     */
    private openRotate(): void {
        const _this = this;
        
        if (!_this.controller || _this.controller.autoRotate) return;
        
        _this.controller.autoRotate = true;
    }
    
    /**
     * 关闭自动旋转
     * @return {void}
     */
    private closeRotate(): void {
        const _this = this;
        
        if (!_this.controller || !_this.controller.autoRotate) return;
        
        _this.controller.autoRotate = false;
    }
}
