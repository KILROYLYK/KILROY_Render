import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

import { RandomWeightList } from '../../../../../_Base/Asset/SDK/Function/function';
import Flame, { FlameConfig } from './component/flame';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private canvas: HTMLCanvasElement = null; // 画布
    private context: CanvasRenderingContext2D = null; // 语境
    private gradient: CanvasGradient = null; // 坡度
    private readonly depth: number = 24; // 最大深度
    private readonly side: RandomWeightList[] = [ // 边权重
        {
            value: 'top',
            weight: 1
        },
        {
            value: 'left',
            weight: 2
        },
        {
            value: 'right',
            weight: 2
        },
        {
            value: 'bottom',
            weight: 10
        }
    ];
    private color: any = { // 颜色
        type: [ // 类型
            [ 0, '#ffffff' ],
            [ 0.1, '#ffda07' ],
            [ 0.4, '#f9b64d' ],
            [ 0.6, '#f54f1f' ],
            [ 0.8, '#f51b19' ],
            [ 1, '#700800' ]
        ],
        list: [] // 列表
    };
    private flame: any = { // 火焰
        shape: 'round' as 'square' | 'round', // 形状
        size: Global.Function.Agent.client() === 'PC' ? 10 : 6, // 尺寸
        table: [], // 表格
        list: [] // 列表
    };
    private readonly component: any = { // 组件
        flame: Flame
    };
    private readonly controller: any = { // 控制器
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
     * @return {void}
     */
    private create(): void {
        this.canvas = document.createElement('canvas');
        this.canvas.width = Global.Root.clientWidth;
        this.canvas.height = Global.Root.clientHeight;
        Global.Root.append(this.canvas);
        
        this.context = this.canvas.getContext('2d');
        this.gradient = this.context.createLinearGradient(0, 0, this.depth, 0);
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.isInit = true;
        
        Global.Function.Resize(() => {
            this.update(true);
            this.initFlame();
        });
        Global.FN.updateFrame(() => {
            this.update();
        });
        
        this.initColor();
        this.initFlame();
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        const row = Math.floor(Global.Focus.y / this.flame.size),
            column = Math.floor(Global.Focus.x / this.flame.size);
        
        if (!this.isInit) return;
        
        if (isResize) {
            this.canvas.width = Global.Root.clientWidth;
            this.canvas.height = Global.Root.clientHeight;
        }
        
        this.clean();
        
        for (let i = 0, n = this.flame.list.length; i < n; i++) {
            const flame = this.flame.list[i],
                rowF = this.flame.table[row],
                columnF = rowF && rowF[column];
            
            if (flame === columnF) flame.depth = 0; // 跟随焦点
            if (flame.depth === this.depth) continue;
            
            flame.update();
        }
    }
    
    /**
     * 清理
     * @return {void}
     */
    private clean(): void {
        this.context.clearRect(0, 0, Global.Root.clientWidth, Global.Root.clientHeight);
    }
    
    /**
     * 初始化颜色
     * @return {void}
     */
    private initColor(): void {
        this.color.type.forEach((v: any, i: number, a: any[]) => {
            this.gradient.addColorStop(v[0], v[1]);
        });
        this.context.fillStyle = this.gradient;
        this.context.fillRect(0, 0, this.depth, 1);
        this.color.list = Array(this.depth)
            .fill(null)
            .map((v: string, i: number, a: any[]) => {
                const data = this.context.getImageData(i, 0, 1, 1).data;
                
                let opacity = 1;
                
                if (i >= this.depth - 3) opacity = 0.5;
                if (i === this.depth - 1) opacity = 0;
                
                return 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + opacity + ')';
            });
        this.clean();
    }
    
    /**
     * 初始化火焰
     * @return {void}
     */
    private initFlame(): void {
        const rowTotal = Math.ceil(Global.Root.clientHeight / this.flame.size),
            columnTotal = Math.ceil(Global.Root.clientWidth / this.flame.size);
        
        this.flame.list = [];
        this.flame.table = Array(rowTotal).fill(Array(columnTotal).fill(null))
            .map((row: any[], iy: number) => {
                return row.map((column: any, ix: number) => {
                    const config: FlameConfig = {
                            color: this.color.list,
                            shape: this.flame.shape,
                            side: this.side,
                            depth: this.color.list.length - 1, // 默认
                            size: this.flame.size,
                            position: {
                                x: ix * this.flame.size,
                                y: iy * this.flame.size
                            }
                        },
                        flame = new this.component.flame(this.context, config);
                    
                    this.flame.list.push(flame);
                    
                    return flame;
                });
            });
        
        this.flame.table.forEach((v: Flame[], i: number) => {
            v.forEach((vv: Flame, ii: number) => {
                vv.setBrother(
                    this.flame.table[i - 1] && this.flame.table[i - 1][ii],
                    this.flame.table[i][ii - 1],
                    this.flame.table[i][ii + 1],
                    this.flame.table[i + 1] && this.flame.table[i + 1][ii],
                );
            });
        });
    }
}
