// @ts-ignore
import * as PIXI from 'pixi.js';
// @ts-ignore
import { TweenMax, Sine, Ease } from '/usr/local/lib/node_modules/gsap';

import Global from '../../../constant/_global';
import Component from '../../../interface/component';

export interface TextureConfig { // 纹理配置
    bg: any // 背景
    bg_shadow: any // 背景阴影
}

/**
 * 背景
 */
export default class Background implements Component {
    private readonly name: string = 'Background-背景';
    
    private container: PIXI.Container = null; // 容器
    private texture: TextureConfig = null; // 纹理
    
    private readonly speed: number = 0.05; // 速度
    private readonly ratio: number = 1652 / 1074; // 宽高比值
    private width: number = 0; // 宽
    private height: number = 0; // 高
    private spriteB: PIXI.Sprite = null; // 背景
    private spriteBS: PIXI.Sprite = null; // 背景阴影
    private readonly moveP: any = { // 移动位置
        x: 0,
        y: 0
    };
    
    private instance: PIXI.filters.DisplacementFilter = null; // 过滤器
    
    /**
     * 构造函数
     * @constructor Background
     * @param {*} container 场景
     * @param {TextureConfig} texture 纹理
     */
    constructor(container: any, texture: TextureConfig) {
        const _this = this;
        
        _this.container = container;
        _this.texture = texture;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        const _this = this,
            bg = _this.texture.bg,
            bgShadow = _this.texture.bg_shadow;
        
        _this.spriteB = new PIXI.Sprite(bg.texture);
        _this.spriteBS = new PIXI.Sprite(bgShadow.texture);
        _this.spriteBS.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        
        _this.instance = new PIXI.filters.DisplacementFilter(_this.spriteBS);
        
        _this.setSize();
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        const _this = this;
        
        _this.container.addChild(_this.spriteB);
        _this.container.addChild(_this.spriteBS);
        
        Global.$D.bind('mousemove', _this.animation.bind(_this));
        Global.$D.bind('touchstart', _this.animation.bind(_this));
        Global.$D.bind('touchmove', _this.animation.bind(_this));
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.instance) return;
        
        if (isResize) {
            _this.setSize();
        }
    }
    
    /**
     * 设置尺寸
     * @return {void}
     */
    private setSize(): void {
        const _this = this,
            ratio = Global.Function.getDomAspect(),
            center = Global.Function.getDomCenter();
        
        switch (true) {
            case ratio >= 1 && ratio >= _this.ratio:
            case ratio <= 1 && ratio >= _this.ratio:
                _this.width = Global.$Root.width() * 1.2;
                _this.height = _this.width / _this.ratio;
                break;
            case ratio >= 1 && ratio <= _this.ratio:
            case ratio <= 1 && ratio <= _this.ratio:
            default:
                _this.height = Global.$Root.height() * 1.2;
                _this.width = _this.height * _this.ratio;
                break
        }
        
        _this.spriteB.width = _this.width;
        _this.spriteB.height = _this.height;
        _this.spriteB.position.set(center.x - _this.width / 2, center.y - _this.height / 2);
        
        _this.spriteBS.width = _this.width;
        _this.spriteBS.height = _this.height;
        _this.spriteBS.position.set(center.x - _this.width / 2, center.y - _this.height / 2);
    }
    
    /**
     * 动画
     * @param {MouseEvent} e 鼠标事件
     * @return {void}
     */
    private animation(e: MouseEvent): void {
        const _this = this,
            centerP = Global.Function.getDomCenter(),
            x = (Global.Focus.x - centerP.x) * _this.speed,
            y = (Global.Focus.y - centerP.y) * _this.speed;
        
        if (Global.Focus.x === e.clientX &&
            Global.Focus.y === e.clientY) return;
        
        TweenMax
            .to(_this.moveP, 1, {
                x, y,
                ease: Sine.easeOut,
                onUpdate(): void {
                    _this.container.filters = [ _this.instance ];
                    _this.spriteB.position.set(centerP.x - _this.width / 2 + _this.moveP.x, centerP.y - _this.height / 2 + _this.moveP.y);
                    _this.spriteBS.position.set(centerP.x - _this.width / 2 + _this.moveP.x, centerP.y - _this.height / 2 + _this.moveP.y);
                    _this.instance.scale.set(-_this.moveP.x, -_this.moveP.y);
                }
            });
    }
}
