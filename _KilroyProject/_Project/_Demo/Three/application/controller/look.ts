import * as THREE from 'three';

import Global from '../constant/_global';
import Controller from '../interface/controller';

export interface LookConfig { // 控制器配置
    turn?: boolean // 开关转向
    focus?: boolean // 开关聚焦
}

/**
 * 移动
 */
export default class Look implements Controller {
    private camera: THREE.PerspectiveCamera = null; // 相机
    
    private targetP: THREE.Vector3 = null; // 视觉目标
    private readonly focusP: any = { // 焦点位置
        mouseX: 0,
        mouseY: 0,
        touchX: 0,
        touchY: 0
    };
    private readonly focusLL: any = { // 焦点经纬度
        far: 0, // 视觉目标距离
        lon: 0, // 经度 X
        lat: 0, // 纬度 Y
        maxLat: 85, // 上下最大纬度
        theta: 0, // 角度
        phi: 0 // 弧度
    };
    private readonly speed: any = { // 速度
        click: 0.0015,
        touch: 0.1,
        wheel: 0.008,
        walk: 3
    };
    private readonly flag: LookConfig = { // 开关
        turn: false,
        focus: false
    };
    
    /**
     * 原型对象
     * @constructor Look
     * @param {*} camera 相机
     * @param {LookConfig} config 配置
     */
    constructor(camera: any, config: LookConfig = {}) {
        this.camera = camera.instance;
        
        this.flag.turn = !!config.turn;
        this.flag.focus = !!config.focus;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        this.targetP = new THREE.Vector3();
        this.focusLL.far = this.camera.far * 2;
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.switchPlatform();
    }
    
    /**
     * 更新
     * @return {void}
     */
    public update(): void {
        if (!this.camera) return;
        
        // 获取视角
        this.focusLL.lat = Math.max(-this.focusLL.maxLat, Math.min(this.focusLL.maxLat, this.focusLL.lat));
        this.focusLL.phi = THREE.MathUtils.degToRad(90 - this.focusLL.lat);
        this.focusLL.theta = THREE.MathUtils.degToRad(this.focusLL.lon - 90);
        
        // 将视觉目标移至视角中心
        Global.FN.setEase(this.targetP, {
            x: Math.sin(this.focusLL.phi) * Math.cos(this.focusLL.theta) * this.focusLL.far,
            y: Math.cos(this.focusLL.phi) * this.focusLL.far,
            z: Math.sin(this.focusLL.phi) * Math.sin(this.focusLL.theta) * this.focusLL.far
        }, 10);
        this.flag.turn && this.camera.lookAt(this.targetP);  // 转向
    }
    
    /**
     * 根据设备绑定方法
     * @return {void}
     */
    private switchPlatform(): void {
        Global.Function.Agent.client() === 'PC'
            ? this.mouseMove()
            : this.touchMove();
    }
    
    /**
     * 点击移动
     * @return {void}
     */
    private mouseMove(): void {
        const mouse = { // 鼠标
                /**
                 * 按下
                 * @param {MouseEvent} e 焦点对象
                 * @return {void}
                 */
                down: (e: MouseEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    addEventListener('mousemove', mouse.move);
                    addEventListener('mouseup', mouse.up);
                },
                
                /**
                 * 移动
                 * @param {MouseEvent} e 焦点对象
                 * @return {void}
                 */
                move: (e: MouseEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const movementX = e.movementX || 0,
                        movementY = e.movementY || 0,
                        speed = this.camera.fov * this.speed.click;
                    
                    this.focusLL.lon -= movementX * speed;
                    this.focusLL.lat += movementY * speed;
                },
                
                /**
                 * 抬起
                 * @param {MouseEvent} e 事件对象
                 * @return {void}
                 */
                up: (e: MouseEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
    
                    addEventListener('mousemove', mouse.move);
                    addEventListener('mouseup', mouse.up);
                },
                
                /**
                 * 中键滚动
                 * @param {WheelEvent} e 焦点对象
                 * @return {void}
                 */
                wheel: (e: WheelEvent): void => {
                    const fov = this.camera.fov + e.deltaY * this.speed.wheel;
                    
                    this.camera.fov = THREE.MathUtils.clamp(fov, 45, 95);
                    this.camera.updateProjectionMatrix();
                }
            };
        
        // 鼠标事件
        this.flag.turn && addEventListener('mousedown', mouse.down); // 转向
        this.flag.focus && addEventListener('wheel', mouse.wheel); // 聚焦
    }
    
    /**
     * 触摸移动
     * @return {void}
     */
    private touchMove() {
        const touch = { // 触摸
                /**
                 * 开始
                 * @param {TouchEvent} e 焦点对象
                 * @return {void}
                 */
                start: (e: TouchEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const t = e.touches[0];
                    this.focusP.touchX = t.screenX;
                    this.focusP.touchY = t.screenY;
    
                    addEventListener('touchmove', touch.move);
                    addEventListener('touchend', touch.end);
                },
                
                /**
                 * 移动
                 * @param {TouchEvent} e 焦点对象
                 * @return {void}
                 */
                move: (e: TouchEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const t = e.touches[0];
                    this.focusLL.lon -= (t.screenX - this.focusP.touchX) * this.speed.touch;
                    this.focusLL.lat += (t.screenY - this.focusP.touchY) * this.speed.touch;
                    
                    this.focusP.touchX = t.screenX;
                    this.focusP.touchY = t.screenY;
                },
                
                /**
                 * 抬起
                 * @param {TouchEvent} e 焦点对象
                 * @return {void}
                 */
                end: (e: TouchEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
    
                    addEventListener('touchmove', touch.move);
                    addEventListener('touchend', touch.end);
                }
            };
        
        // 触摸事件
        this.flag.turn && addEventListener('touchstart', touch.start); // 转向
    }
}
