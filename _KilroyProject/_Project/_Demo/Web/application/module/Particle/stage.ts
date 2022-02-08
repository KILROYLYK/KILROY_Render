import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

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
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        this.canvas = document.createElement('canvas');
        this.canvas.width = Global.Root.clientWidth;
        this.canvas.height = Global.Root.clientHeight;
        Global.Root.append(this.canvas);
        
        this.context = this.canvas.getContext('2d');
        
        this.component.particle = new Particle(this.context as CanvasRenderingContext2D);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.isInit = true;
    
        Global.Function.Resize(() => {
            this.update(true);
        });
        Global.FN.updateFrame(() => {
            this.update();
        });
        Global.FN.updateFocus(false);
        
        this.component.particle.writeText('♥');
        this.component.particle.writeText('KILROY');
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        if (!this.isInit) return;
        
        if (isResize) {
            this.canvas.width = Global.Root.clientWidth;
            this.canvas.height = Global.Root.clientHeight;
        }
        
        this.component.particle.update(isResize);
    }
}
