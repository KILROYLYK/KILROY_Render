import Global from '../../../constant/_global';
import Component from '../../../interface/component';

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
        const _this = this;
        
        _this.context = context;
        
        _this.color = config.color;
        _this.shape = config.shape;
        _this.side = config.side;
        _this.size = config.size;
        _this.position = config.position;
        _this.depth = config.depth;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const _this = this;
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
        const _this = this,
            side = Global.FN.calc.randomWeight(_this.side),
            brother = _this.brother[side];
        
        _this.drawFlame();
        
        if (brother && brother.depth < _this.depth) {
            const rand = Global.FN.calc.random(-1, 5);
            _this.depth = brother.depth + rand;
        } else {
            _this.depth += 1;
        }
        
        if (_this.depth > this.color.length - 1) {
            _this.depth = this.color.length - 1;
        } else if (_this.depth <= 0) {
            _this.depth = 0;
        }
    }
    
    /**
     * 绘制火焰
     */
    private drawFlame(): void {
        const _this = this;
        
        _this.context.fillStyle = _this.color[_this.depth];
        
        switch (_this.shape) {
            case 'square':
                _this.context.fillRect(_this.position.x, _this.position.y, _this.size, _this.size);
                break;
            case 'round':
                _this.context.beginPath();
                _this.context.arc(_this.position.x, _this.position.y, _this.size / 2, 0, 2 * Math.PI);
                _this.context.fill();
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
        const _this = this;
        
        _this.brother.top = top;
        _this.brother.left = left;
        _this.brother.right = right;
        _this.brother.bottom = bottom;
    }
}
