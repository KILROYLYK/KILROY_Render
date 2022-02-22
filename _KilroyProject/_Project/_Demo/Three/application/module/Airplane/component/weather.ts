// @ts-ignore
import Tween from 'tween.ts';
import * as THREE from 'three';

import Component from '../../../interface/component';

/**
 * 天气
 */
export default class Weather implements Component {
    private readonly name: string = 'Weather-天气';
    
    private scene: THREE.Scene = null; // 场景
    
    private isSwitch: boolean = false; // 是否正在切换
    private day: boolean = false; // 是否是白天
    private initY: number = -1000; // 初始高度
    private sun: THREE.Mesh = null; // 太阳
    private moon: THREE.Mesh = null; // 月亮
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Weather
     * @param {*} scene 场景
     */
    constructor(scene: any) {
        this.scene = scene.instance;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, 0, -850);
        
        this.createSun();
        this.createMoon();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.instance.add(this.sun);
        this.instance.add(this.moon);
        this.scene.add(this.instance);
        
        this.switchDay();
        
        addEventListener('keyup', (e: KeyboardEvent) => {
            (e.code === 'Space') && this.switchDay();
        });
    }
    
    /**
     * 更新
     */
    public update(): void {
        if (!this.instance) return;
    }
    
    /**
     * 创建太阳
     */
    private createSun(): void {
        const geometry = new THREE.SphereGeometry(
            1200, 20, 10
        );
        geometry.scale(1, 1, 0.1);
        
        const material = new THREE.MeshPhongMaterial({
            color: '#fffd00',
            flatShading: true
        });
        
        this.sun = new THREE.Mesh(geometry, material);
        this.sun.name = this.name;
        this.sun.position.set(0, this.initY, 0);
    }
    
    /**
     * 创建月亮
     */
    private createMoon(): void {
        const geometry = new THREE.SphereGeometry(
            700, 20, 10
        );
        geometry.scale(1, 1, 0.2);
        
        const material = new THREE.MeshPhongMaterial({
            color: '#ffffff',
            flatShading: true
        });
        
        this.moon = new THREE.Mesh(geometry, material);
        this.moon.name = this.name;
        this.moon.position.set(0, this.initY, 0);
    }
    
    /**
     * 切换昼夜
     */
    private switchDay(): void {
        const tween = Tween.Tween,
            ease = Tween.Easing.Cubic.InOut,
            timeA = 3000, // 动画时间
            timeD = 2000, // 延迟时间
            color = [
                '#ffe1b9',
                '#000783'
            ],
            bg = this.scene.background,
            fog = this.scene.fog.color,
            sun = this.sun.position,
            moon = this.moon.position;
        
        if (this.isSwitch) return;
        this.isSwitch = true;
        
        if (this.day) { // 切换到黑夜
            this.day = false;
            
            const bgColor = new THREE.Color(color[1]),
                tweenBG = new tween(bg)
                    .easing(ease)
                    .delay(timeD)
                    .to({
                        b: bgColor.b,
                        g: bgColor.g,
                        r: bgColor.r
                    }, timeA)
                    .onComplete(() => {
                        tweenBG.stop();
                    })
                    .onStop(() => {
                    })
                    .start(),
                tweenFog = new tween(fog)
                    .easing(ease)
                    .delay(timeD)
                    .to({
                        b: bgColor.b,
                        g: bgColor.g,
                        r: bgColor.r
                    }, timeA)
                    .onComplete(() => {
                        tweenFog.stop();
                    })
                    .onStop(() => {
                    })
                    .start();
            
            const tweenSun = new tween(sun)
                .easing(ease)
                .to({
                    y: this.initY
                }, timeA)
                .onComplete(() => {
                    tweenSun.stop();
                })
                .onStop(() => {
                })
                .start();
            
            const tweenMoon = new tween(moon)
                .easing(ease)
                .delay(timeD)
                .to({
                    y: 850
                }, timeA)
                .onComplete(() => {
                    tweenMoon.stop();
                })
                .onStop(() => {
                    this.isSwitch = false;
                })
                .start();
        } else { // 切换到白昼
            this.day = true;
            
            const bgColor = new THREE.Color(color[0]),
                tweenBG = new tween(bg)
                    .easing(ease)
                    .delay(timeD)
                    .to({
                        b: bgColor.b,
                        g: bgColor.g,
                        r: bgColor.r
                    }, timeA)
                    .onComplete(() => {
                        tweenBG.stop();
                    })
                    .onStop(() => {
                    })
                    .start(),
                tweenFog = new tween(fog)
                    .easing(ease)
                    .delay(timeD)
                    .to({
                        b: bgColor.b,
                        g: bgColor.g,
                        r: bgColor.r
                    }, timeA)
                    .onComplete(() => {
                        tweenFog.stop();
                    })
                    .onStop(() => {
                    })
                    .start();
            
            const tweenSun = new tween(sun)
                .easing(ease)
                .delay(timeD)
                .to({
                    y: 450
                }, timeA)
                .onComplete(() => {
                    tweenSun.stop();
                })
                .onStop(() => {
                    this.isSwitch = false;
                })
                .start();
            
            const tweenMoon = new tween(moon)
                .easing(ease)
                .to({
                    y: this.initY
                }, timeA)
                .onComplete(() => {
                    tweenMoon.stop();
                })
                .onStop(() => {
                })
                .start();
        }
    }
}
