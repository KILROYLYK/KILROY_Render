import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Component from '../../../interface/component';
import Global from '../../../../../1/_global';
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
        const _this = this;
        
        _this.renderer = config.renderer;
        _this.scene = config.scene;
        _this.camera = config.camera;
        _this.skull = config.skull;
        _this.texture = config.texture;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const _this = this;
        
        _this.createCardRenderer();
        _this.createCardFront();
        _this.createCardBack();
        
        _this.instance = new THREE.Group();
        _this.instance.name = _this.name;
        _this.instance.position.set(0, 0, 0);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.cardScene.add(_this.skull.instance);
        
        _this.composer.addPass(_this.passRender);
        _this.composer.addPass(_this.passUB);
        
        _this.instance.add(_this.frontMesh);
        _this.instance.add(_this.backMesh);
        _this.scene.add(_this.instance);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        _this.skull.instance.rotation.set(-_this.camera.rotation.x, -_this.camera.rotation.y, 0);
        
        _this.composer.render();
        
        if (isResize) { // 屏幕变化
            _this.cardCamera.aspect = _this.aspect;
            _this.cardCamera.updateProjectionMatrix();
        }
    }
    
    /**
     * 创建卡牌渲染
     * @return {void}
     */
    private createCardRenderer(): void {
        const _this = this;
        
        _this.cardScene = new THREE.Scene();
        _this.cardScene.background = new THREE.Color('#000000');
        
        _this.cardCamera = new THREE.PerspectiveCamera(
            30, _this.aspect, 1, 500
        );
        _this.cardCamera.position.z = 100;
        
        _this.passRender = new RenderPass(
            _this.cardScene,
            _this.cardCamera
        );
        
        _this.passUB = new UnrealBloomPass(
            new THREE.Vector2(Global.$Root.width(), Global.$Root.height()),
            0.8, 1.2, 0.2
        );
        _this.passUB.renderToScreen = true;
        
        _this.composer = new EffectComposer(_this.renderer);
        _this.composer.renderToScreen = false;
    }
    
    /**
     * 创建卡牌正面
     * @return {void}
     */
    private createCardFront(): void {
        const _this = this,
            geometry = new THREE.PlaneGeometry(
                _this.width * _this.scale,
                _this.height * _this.scale
            ),
            material = new THREE.ShaderMaterial({
                uniforms: {
                    _content: {
                        value: _this.composer.readBuffer.texture
                    },
                    _border_1: {
                        value: _this.texture.card_front
                    },
                    _border_2: {
                        value: _this.texture.color_2
                    },
                    _color: {
                        value: _this.texture.color_1
                    },
                    _noise_1: {
                        value: _this.texture.noise_1
                    },
                    _noise_2: {
                        value: _this.texture.noise_2
                    }
                },
                vertexShader: vertCard,
                fragmentShader: fragCardFront,
                transparent: true,
                depthWrite: false
            });
        _this.frontMesh = new THREE.Mesh(geometry, material);
    }
    
    /**
     * 创建卡牌背面
     * @return {void}
     */
    private createCardBack(): void {
        const _this = this,
            geometry = new THREE.PlaneGeometry(
                _this.width * _this.scale,
                _this.height * _this.scale
            ),
            material = new THREE.ShaderMaterial({
                uniforms: {
                    _content: {
                        value: _this.texture.card_pattern
                    },
                    _border_1: {
                        value: _this.texture.card_back
                    },
                    _border_2: {
                        value: _this.texture.color_2
                    },
                    _color: {
                        value: _this.texture.color_1
                    },
                    _noise_1: {
                        value: _this.texture.noise_1
                    },
                    _noise_2: {
                        value: _this.texture.noise_2
                    }
                },
                vertexShader: vertCard,
                fragmentShader: fragCardBack,
                transparent: true,
                depthWrite: false
            });
        _this.backMesh = new THREE.Mesh(geometry, material);
        _this.backMesh.rotation.set(0, Math.PI, 0);
    }
}
