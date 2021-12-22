import * as THREE from 'three';

import Global from '../../../constant/_global';
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
     */
    private create(): void {
        const _this = this;
        
        _this.instance = new THREE.WebGLRenderer({
            antialias: true // 抗锯齿
        });
        _this.instance.setSize(Global.Width, Global.Height);
        _this.instance.outputEncoding = THREE.sRGBEncoding;
        _this.instance.shadowMap.enabled = true;
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.instance) return;
        
        if (isResize) { // 屏幕变化
            _this.instance.setSize(Global.Width, Global.Height);
        }
    }
}
