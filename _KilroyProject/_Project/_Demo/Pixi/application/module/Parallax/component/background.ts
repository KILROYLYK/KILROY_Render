// @ts-ignore
import GSAP, { Sine } from 'gsap';
// @ts-ignore
import * as PIXI from 'pixi.js';

import { Vector2 } from '../../../interface/public';
import Component from '../../../interface/component';
import Global from '../../../constant/_global';

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
    private readonly moveP: Vector2 = { // 移动位置
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
        this.container = container;
        this.texture = texture;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        const bg = this.texture.bg,
            bgShadow = this.texture.bg_shadow;
        
        this.spriteB = new PIXI.Sprite(bg.texture);
        this.spriteBS = new PIXI.Sprite(bgShadow.texture);
        this.spriteBS.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        
        this.instance = new PIXI.filters.DisplacementFilter(this.spriteBS);
        
        this.setSize();
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.container.addChild(this.spriteB);
        this.container.addChild(this.spriteBS);
        
        document.addEventListener('mousemove', this.animation.bind(this));
        document.addEventListener('touchstart', this.animation.bind(this));
        document.addEventListener('touchmove', this.animation.bind(this));
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        if (!this.instance) return;
        
        if (isResize) {
            this.setSize();
        }
    }
    
    /**
     * 设置尺寸
     * @return {void}
     */
    private setSize(): void {
        const ratio = Global.FN.getDomAspect(),
            center = Global.FN.getDomCenter();
        
        switch (true) {
            case ratio >= 1 && ratio >= this.ratio:
            case ratio <= 1 && ratio >= this.ratio:
                this.width = Global.Root.clientWidth * 1.2;
                this.height = this.width / this.ratio;
                break;
            case ratio >= 1 && ratio <= this.ratio:
            case ratio <= 1 && ratio <= this.ratio:
            default:
                this.height = Global.Root.clientHeight * 1.2;
                this.width = this.height * this.ratio;
                break
        }
        
        this.spriteB.width = this.width;
        this.spriteB.height = this.height;
        this.spriteB.position.set(center.x - this.width / 2, center.y - this.height / 2);
        
        this.spriteBS.width = this.width;
        this.spriteBS.height = this.height;
        this.spriteBS.position.set(center.x - this.width / 2, center.y - this.height / 2);
    }
    
    /**
     * 动画
     * @param {MouseEvent} e 鼠标事件
     * @return {void}
     */
    private animation(e: MouseEvent): void {
        const centerP = Global.FN.getDomCenter(),
            x = (Global.Focus.x - centerP.x) * this.speed,
            y = (Global.Focus.y - centerP.y) * this.speed;
        
        if (Global.Focus.x === e.clientX &&
            Global.Focus.y === e.clientY) return;
        
        GSAP.to(this.moveP, 1, {
            x, y,
            ease: Sine.easeOut,
            onUpdate: (): void => {
                this.container.filters = [ this.instance ];
                this.spriteB.position.set(centerP.x - this.width / 2 + this.moveP.x, centerP.y - this.height / 2 + this.moveP.y);
                this.spriteBS.position.set(centerP.x - this.width / 2 + this.moveP.x, centerP.y - this.height / 2 + this.moveP.y);
                this.instance.scale.set(-this.moveP.x, -this.moveP.y);
            }
        });
    }
}
