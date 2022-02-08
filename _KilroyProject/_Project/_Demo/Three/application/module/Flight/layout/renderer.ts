import * as THREE from 'three';

import Global from '../../../../../1/_global';
import Layout from '../../../interface/layout';

/**
 * 渲染器
 */
export default class Renderer implements Layout {
    public instance: THREE.WebGLRenderer = null; // 实例
    
    /**
     * 构造函数
     * @constructor Renderer
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
        
        _this.instance = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            precision: 'mediump'
        });
        _this.instance.setSize(Global.Width, Global.Height);
        _this.instance.setPixelRatio(Global.W.devicePixelRatio);
        _this.instance.setClearColor('#000000', 0);
        _this.instance.sortObjects = true;
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
     * @param {boolean} isResize 是否调整大小
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.instance) return;
        
        if (isResize) { // 屏幕变化
            _this.instance.setSize(Global.Width, Global.Height);
        }
    }
}
