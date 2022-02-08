import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';
import Skull from './skull';

// @ts-ignore
import vertCard from '../shader/vertCard.shader';
// @ts-ignore
import fragCardFront from '../shader/fragCardFront.shader';
// @ts-ignore
import fragCardBack from '../shader/fragCardBack.shader';

export interface CardConfig { // 卡牌配置
    renderer: THREE.WebGLRenderer; // 渲染器
    scene: THREE.Scene; // 场景
    camera: THREE.PerspectiveCamera; // 相机
    skull: Skull; // 骷髅
    texture: CardTexture; // 纹理
}

export interface CardTexture { // 卡牌纹理
    card_front: THREE.Texture;
    card_back: THREE.Texture;
    card_pattern: THREE.Texture;
    color_1: THREE.Texture;
    color_2: THREE.Texture;
    noise_1: THREE.Texture;
    noise_2: THREE.Texture;
}

/**
 * 卡牌
 */
export default class Card implements Component {
    private readonly name: string = 'Card-卡牌';
    
    private renderer: THREE.WebGLRenderer = null; // 渲染器
    private scene: THREE.Scene = null; // 场景
    private camera: THREE.PerspectiveCamera = null; // 相机
    private skull: Skull = null; // 骷髅
    private texture: CardTexture = null; // 纹理
    
    private cardScene: THREE.Scene = null; // 卡牌场景
    private cardCamera: THREE.PerspectiveCamera = null; // 卡牌相机
    private passRender: RenderPass = null; // 渲染通道
    private passUB: UnrealBloomPass = null; // 虚幻绽放通道
    private composer: EffectComposer = null; // 后期处理
    private frontMesh: THREE.Mesh = null; // 正面模型
    private backMesh: THREE.Mesh = null; // 背面模型
    private width: number = 2; // 宽度
    private height: number = 3; // 高度
    private scale: number = 10; // 缩放尺寸
    private aspect: number = this.width / this.height; // 宽高比
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Card
     * @param {CardConfig} config 配置
     */
    constructor(config: CardConfig) {
        this.renderer = config.renderer;
        this.scene = config.scene;
        this.camera = config.camera;
        this.skull = config.skull;
        this.texture = config.texture;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        this.createCardRenderer();
        this.createCardFront();
        this.createCardBack();
        
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, 0, 0);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.cardScene.add(this.skull.instance);
        
        this.composer.addPass(this.passRender);
        this.composer.addPass(this.passUB);
        
        this.instance.add(this.frontMesh);
        this.instance.add(this.backMesh);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        this.skull.instance.rotation.set(-this.camera.rotation.x, -this.camera.rotation.y, 0);
        
        this.composer.render();
        
        if (isResize) { // 屏幕变化
            this.cardCamera.aspect = this.aspect;
            this.cardCamera.updateProjectionMatrix();
        }
    }
    
    /**
     * 创建卡牌渲染
     * @return {void}
     */
    private createCardRenderer(): void {
        this.cardScene = new THREE.Scene();
        this.cardScene.background = new THREE.Color('#000000');
        
        this.cardCamera = new THREE.PerspectiveCamera(
            30, this.aspect, 1, 500
        );
        this.cardCamera.position.z = 100;
        
        this.passRender = new RenderPass(
            this.cardScene,
            this.cardCamera
        );
        
        this.passUB = new UnrealBloomPass(
            new THREE.Vector2(Global.Root.clientWidth, Global.Root.clientHeight),
            0.8, 1.2, 0.2
        );
        this.passUB.renderToScreen = true;
        
        this.composer = new EffectComposer(this.renderer);
        this.composer.renderToScreen = false;
    }
    
    /**
     * 创建卡牌正面
     * @return {void}
     */
    private createCardFront(): void {
        const geometry = new THREE.PlaneGeometry(this.width * this.scale, this.height * this.scale),
            material = new THREE.ShaderMaterial({
                uniforms: {
                    _content: {
                        value: this.composer.readBuffer.texture
                    },
                    _border_1: {
                        value: this.texture.card_front
                    },
                    _border_2: {
                        value: this.texture.color_2
                    },
                    _color: {
                        value: this.texture.color_1
                    },
                    _noise_1: {
                        value: this.texture.noise_1
                    },
                    _noise_2: {
                        value: this.texture.noise_2
                    }
                },
                vertexShader: vertCard,
                fragmentShader: fragCardFront,
                transparent: true,
                depthWrite: false
            });
        this.frontMesh = new THREE.Mesh(geometry, material);
    }
    
    /**
     * 创建卡牌背面
     * @return {void}
     */
    private createCardBack(): void {
        const geometry = new THREE.PlaneGeometry(this.width * this.scale, this.height * this.scale),
            material = new THREE.ShaderMaterial({
                uniforms: {
                    _content: {
                        value: this.texture.card_pattern
                    },
                    _border_1: {
                        value: this.texture.card_back
                    },
                    _border_2: {
                        value: this.texture.color_2
                    },
                    _color: {
                        value: this.texture.color_1
                    },
                    _noise_1: {
                        value: this.texture.noise_1
                    },
                    _noise_2: {
                        value: this.texture.noise_2
                    }
                },
                vertexShader: vertCard,
                fragmentShader: fragCardBack,
                transparent: true,
                depthWrite: false
            });
        this.backMesh = new THREE.Mesh(geometry, material);
        this.backMesh.rotation.set(0, Math.PI, 0);
    }
}
