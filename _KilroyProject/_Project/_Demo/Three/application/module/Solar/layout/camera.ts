// @ts-ignore
import { Tween, Easing } from 'tween.ts';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Layout from '../../../interface/layout';
import Global from '../../../constant/_global';

/**
 * 相机
 */
export default class Camera implements Layout {
    private controller: OrbitControls = null; // 控制器
    
    private setTime: any = 0; // 定时器
    
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
        this.instance = new THREE.PerspectiveCamera(60, Global.FN.getDomAspect(), 1, 40000);
        this.instance.position.set(0, 20000, 0);
        
        this.createController();
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.switchPosition();
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
        this.controller.enabled = false;
    }
    
    /**
     * 切换位置
     * @return {void}
     */
    private switchPosition(): void {
        const tween = new Tween(this.instance.position)
            .easing(Easing.Cubic.InOut)
            .delay(5000)
            .to({
                x: 0,
                y: 500,
                z: 5000
            }, 3000)
            .onComplete(() => {
                tween.stop();
                
                this.openRotate();
                this.openController();
            })
            .onStop(() => {
                addEventListener('mousedown', () => {
                    this.setTime !== 0 && clearTimeout(this.setTime);
                    this.closeRotate();
                }, false);
                addEventListener('mouseup', () => {
                    this.setTime = setTimeout(() => {
                        this.setTime = 0;
                        this.openRotate();
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
        this.controller.enabled = true;
        this.controller.enableDamping = true;
        this.controller.enablePan = false;
        this.controller.enableKeys = false;
        this.controller.minPolarAngle = Math.PI * 0.3;
        this.controller.maxPolarAngle = Math.PI * 0.7;
        this.controller.minDistance = 500;
        this.controller.maxDistance = 20000;
        this.controller.autoRotateSpeed = 0.2;
    }
    
    /**
     * 开启自动旋转
     * @return {void}
     */
    private openRotate(): void {
        if (!this.controller || this.controller.autoRotate) return;
        
        this.controller.autoRotate = true;
    }
    
    /**
     * 关闭自动旋转
     * @return {void}
     */
    private closeRotate(): void {
        if (!this.controller || !this.controller.autoRotate) return;
        
        this.controller.autoRotate = false;
    }
}
