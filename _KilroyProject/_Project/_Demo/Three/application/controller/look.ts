import * as THREE from 'three';

import Global from '../../../1/_global';
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
        const _this = this;
        
        _this.camera = camera.instance;
        
        _this.flag.turn = !!config.turn;
        _this.flag.focus = !!config.focus;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        const _this = this;
        
        _this.targetP = new THREE.Vector3();
        _this.focusLL.far = _this.camera.far * 2;
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        const _this = this;
        
        _this.switchPlatform();
    }
    
    /**
     * 更新
     * @return {void}
     */
    public update(): void {
        const _this = this;
        
        if (!_this.camera) return;
        
        // 获取视角
        _this.focusLL.lat = Math.max(-_this.focusLL.maxLat, Math.min(_this.focusLL.maxLat, _this.focusLL.lat));
        _this.focusLL.phi = THREE.MathUtils.degToRad(90 - _this.focusLL.lat);
        _this.focusLL.theta = THREE.MathUtils.degToRad(_this.focusLL.lon - 90);
        
        // 将视觉目标移至视角中心
        Global.Function.setEase(_this.targetP, {
            x: Math.sin(_this.focusLL.phi) * Math.cos(_this.focusLL.theta) * _this.focusLL.far,
            y: Math.cos(_this.focusLL.phi) * _this.focusLL.far,
            z: Math.sin(_this.focusLL.phi) * Math.sin(_this.focusLL.theta) * _this.focusLL.far
        }, 10);
        _this.flag.turn && _this.camera.lookAt(_this.targetP);  // 转向
    }
    
    /**
     * 根据设备绑定方法
     * @return {void}
     */
    private switchPlatform(): void {
        const _this = this;
        
        Global.FN.agent.client() === 'PC'
            ? _this.mouseMove()
            : _this.touchMove();
    }
    
    /**
     * 点击移动
     * @return {void}
     */
    private mouseMove(): void {
        const _this = this,
            mouse = { // 鼠标
                /**
                 * 按下
                 * @param {MouseEvent} e 焦点对象
                 * @return {void}
                 */
                down: (e: MouseEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    Global.$W.bind('mousemove', mouse.move);
                    Global.$W.bind('mouseup', mouse.up);
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
                        speed = _this.camera.fov * _this.speed.click;
                    
                    _this.focusLL.lon -= movementX * speed;
                    _this.focusLL.lat += movementY * speed;
                },
                
                /**
                 * 抬起
                 * @param {MouseEvent} e 事件对象
                 * @return {void}
                 */
                up: (e: MouseEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    Global.$W.bind('mousemove', mouse.move);
                    Global.$W.bind('mouseup', mouse.up);
                },
                
                /**
                 * 中键滚动
                 * @param {WheelEvent} e 焦点对象
                 * @return {void}
                 */
                wheel: (e: WheelEvent): void => {
                    const fov = _this.camera.fov + e.deltaY * _this.speed.wheel;
                    
                    _this.camera.fov = THREE.MathUtils.clamp(fov, 45, 95);
                    _this.camera.updateProjectionMatrix();
                }
            };
        
        // 鼠标事件
        _this.flag.turn && Global.$W.bind('mousedown', mouse.down); // 转向
        _this.flag.focus && Global.$W.bind('wheel', mouse.wheel); // 聚焦
    }
    
    /**
     * 触摸移动
     * @return {void}
     */
    private touchMove() {
        const _this = this,
            touch = { // 触摸
                /**
                 * 开始
                 * @param {TouchEvent} e 焦点对象
                 * @return {void}
                 */
                start: (e: TouchEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const t = e.touches[0];
                    _this.focusP.touchX = t.screenX;
                    _this.focusP.touchY = t.screenY;
                    
                    Global.$W.bind('touchmove', touch.move);
                    Global.$W.bind('touchend', touch.end);
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
                    _this.focusLL.lon -= (t.screenX - _this.focusP.touchX) * _this.speed.touch;
                    _this.focusLL.lat += (t.screenY - _this.focusP.touchY) * _this.speed.touch;
                    
                    _this.focusP.touchX = t.screenX;
                    _this.focusP.touchY = t.screenY;
                },
                
                /**
                 * 抬起
                 * @param {TouchEvent} e 焦点对象
                 * @return {void}
                 */
                end: (e: TouchEvent): void => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    Global.$W.bind('touchmove', touch.move);
                    Global.$W.bind('touchend', touch.end);
                }
            };
        
        // 触摸事件
        _this.flag.turn && Global.$W.bind('touchstart', touch.start); // 转向
    }
}
