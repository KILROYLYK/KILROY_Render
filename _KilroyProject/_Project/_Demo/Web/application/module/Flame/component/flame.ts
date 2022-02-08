import Component from '../../../interface/component';
import Global from '../../../constant/_global';

import { RandomWeightList } from '../../../../../../_Base/Asset/SDK/Function/function';

export interface FlameConfig { // 火焰配置
    color: string[]; // 颜色
    shape: 'square' | 'round'; // 形状
    side: RandomWeightList[];// 边权重
    size: number; // 尺寸
    position: { // 位置
        x: number;
        y: number;
    };
    depth: number; // 深度
}



/**
 * 火焰
 */
export default class Flame implements Component {
    private context: CanvasRenderingContext2D = null; // 语境
    private color: string[] = []; // 颜色数组
    private shape: 'square' | 'round' = 'square'; // 形状
    private side: RandomWeightList[] = []; // 边
    private size: number = 0; // 尺寸
    private position: any = { // 位置
        x: 0,
        y: 0
    };
    private brother: any = { // 兄弟元素
        top: null,
        left: null,
        right: null,
        bottom: null
    };
    public depth: number = 0; // 深度
    
    /**
     * 构造函数
     * @constructor Flame
     * @param {CanvasRenderingContext2D} context 语境
     * @param {FlameConfig} config 配置
     */
    constructor(context: CanvasRenderingContext2D, config: FlameConfig) {
        this.context = context;
        
        this.color = config.color;
        this.shape = config.shape;
        this.side = config.side;
        this.size = config.size;
        this.position = config.position;
        this.depth = config.depth;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
    }
    
    /**
     * 初始化
     */
    private init(): void {
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const side = Global.Function.Calc.randomWeight(this.side),
            brother = this.brother[side];
        
        this.drawFlame();
        
        if (brother && brother.depth < this.depth) {
            const rand = Global.Function.Calc.random(-1, 5);
            this.depth = brother.depth + rand;
        } else {
            this.depth += 1;
        }
        
        if (this.depth > this.color.length - 1) {
            this.depth = this.color.length - 1;
        } else if (this.depth <= 0) {
            this.depth = 0;
        }
    }
    
    /**
     * 绘制火焰
     */
    private drawFlame(): void {
        this.context.fillStyle = this.color[this.depth];
        
        switch (this.shape) {
            case 'square':
                this.context.fillRect(this.position.x, this.position.y, this.size, this.size);
                break;
            case 'round':
                this.context.beginPath();
                this.context.arc(this.position.x, this.position.y, this.size / 2, 0, 2 * Math.PI);
                this.context.fill();
                break;
        }
    }
    
    /**
     * 设置兄弟元素
     * @param {Flame} top 顶部元素
     * @param {Flame} left 左边元素
     * @param {Flame} right 右边元素
     * @param {Flame} bottom 底部元素
     */
    public setBrother(top: Flame, left: Flame, right: Flame, bottom: Flame): void {
        this.brother.top = top;
        this.brother.left = left;
        this.brother.right = right;
        this.brother.bottom = bottom;
    }
}
