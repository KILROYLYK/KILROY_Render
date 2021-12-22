import Global from '../../constant/_global';
import _Stage from '../../interface/stage';

import Particle from './component/particle';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private canvas: HTMLCanvasElement = null; // 画布
    private context: CanvasRenderingContext2D = null; // 语境
    private component: any = { // 组件
        particle: null // 粒子对象
    };
    private controller: any = { // 控制器
    };
    
    /**
     * 构造函数
     * @constructor Stage
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
        
        _this.canvas = Global.Document.createElement('canvas');
        _this.canvas.width = Global.$Root.width();
        _this.canvas.height = Global.$Root.height();
        Global.$Root.append(_this.canvas);
        
        _this.context = _this.canvas.getContext('2d');
        
        _this.component.particle = new Particle(_this.context as CanvasRenderingContext2D);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.isInit = true;
        
        Global.FN.resize(() => {
            Global.Function.updateSize();
            _this.update(true);
        });
        Global.Function.updateFrame(() => {
            _this.update();
        });
        Global.Function.updateFocus(false);
        
        _this.component.particle.writeText('♥');
        _this.component.particle.writeText('KILROY');
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.isInit) return;
        
        if (isResize) {
            _this.canvas.width = Global.$Root.width();
            _this.canvas.height = Global.$Root.height();
        }
        
        _this.component.particle.update(isResize);
    }
}
