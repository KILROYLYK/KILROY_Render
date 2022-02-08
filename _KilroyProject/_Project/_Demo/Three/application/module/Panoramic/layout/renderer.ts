import * as THREE from 'three';

import Layout from '../../../interface/layout';
import Global from '../../../constant/_global';

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
        this.create();
        this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        this.instance = new THREE.WebGLRenderer({
            logarithmicDepthBuffer: true
        });
        this.instance.setSize(Global.Root.clientWidth, Global.Root.clientHeight);
        this.instance.setPixelRatio(devicePixelRatio);
        this.instance.sortObjects = false;
        this.instance.autoClear = false;
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        if (!this.instance) return;
        
        if (isResize) { // 屏幕变化
            this.instance.setSize(Global.Root.clientWidth, Global.Root.clientHeight);
        }
    }
}
