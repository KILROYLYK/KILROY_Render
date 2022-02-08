import Global from '../../constant/_global';
import _Stage from '../../interface/stage';

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
        const _this = this;
        
        _this.create();
        _this.init();
    }
    
    //---------- 生命周期 Start ----------//
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        const _this = this;
        
        _this.canvas = document.createElement('canvas');
        _this.canvas.width = Global.Root.clientWidth;
        _this.canvas.height = Global.Root.clientHeight;
        Global.Root.append(_this.canvas);
        
        _this.context = _this.canvas.getContext('2d');
        _this.gradient = _this.context.createLinearGradient(0, 0, _this.depth, 0);
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        const _this = this;
        
        _this.isInit = true;
        
        Global.Function.Resize(() => {
            _this.update(true);
            _this.initFlame();
        });
        Global.FN.updateFrame(() => {
            _this.update();
        });
        
        _this.initColor();
        _this.initFlame();
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        const _this = this,
            row = Math.floor(Global.Focus.y / _this.flame.size),
            column = Math.floor(Global.Focus.x / _this.flame.size);
        
        if (!_this.isInit) return;
        
        if (isResize) {
            _this.canvas.width = Global.Root.clientWidth;
            _this.canvas.height = Global.Root.clientHeight;
        }
        
        _this.clean();
        
        for (let i = 0, n = _this.flame.list.length; i < n; i++) {
            const flame = _this.flame.list[i],
                rowF = _this.flame.table[row],
                columnF = rowF && rowF[column];
            
            if (flame === columnF) flame.depth = 0; // 跟随焦点
            if (flame.depth === _this.depth) continue;
            
            flame.update();
        }
    }
    
    /**
     * 清理
     * @return {void}
     */
    private clean(): void {
        const _this = this;
        
        _this.context.clearRect(0, 0, Global.Root.clientWidth, Global.Root.clientHeight);
    }
    
    //---------- 生命周期 End ----------//
    
    /**
     * 初始化颜色
     * @return {void}
     */
    private initColor(): void {
        const _this = this;
        
        _this.color.type.forEach((v: any, i: number, a: any[]) => {
            _this.gradient.addColorStop(v[0], v[1]);
        });
        _this.context.fillStyle = _this.gradient;
        _this.context.fillRect(0, 0, _this.depth, 1);
        _this.color.list = Array(_this.depth)
            .fill(null)
            .map((v: string, i: number, a: any[]) => {
                const data = _this.context.getImageData(i, 0, 1, 1).data;
                
                let opacity = 1;
                
                if (i >= _this.depth - 3) opacity = 0.5;
                if (i === _this.depth - 1) opacity = 0;
                
                return 'rgba(' + data[0] + ', ' + data[1] + ', ' + data[2] + ', ' + opacity + ')';
            });
        _this.clean();
    }
    
    /**
     * 初始化火焰
     * @return {void}
     */
    private initFlame(): void {
        const _this = this,
            rowTotal = Math.ceil(Global.Root.clientHeight / _this.flame.size),
            columnTotal = Math.ceil(Global.Root.clientWidth / _this.flame.size);
        
        _this.flame.list = [];
        _this.flame.table = Array(rowTotal).fill(Array(columnTotal).fill(null))
            .map((row: any[], iy: number) => {
                return row.map((column: any, ix: number) => {
                    const config: FlameConfig = {
                            color: _this.color.list,
                            shape: _this.flame.shape,
                            side: _this.side,
                            depth: _this.color.list.length - 1, // 默认
                            size: _this.flame.size,
                            position: {
                                x: ix * _this.flame.size,
                                y: iy * _this.flame.size
                            }
                        },
                        flame = new _this.component.flame(_this.context, config);
                    
                    _this.flame.list.push(flame);
                    
                    return flame;
                });
            });
        
        Global.Function.Array.traversing(_this.flame.table, (i: number, v: Flame[]) => {
            Global.Function.Array.traversing(v, (ii: number, vv: Flame) => {
                vv.setBrother(
                    _this.flame.table[i - 1] && _this.flame.table[i - 1][ii],
                    _this.flame.table[i][ii - 1],
                    _this.flame.table[i][ii + 1],
                    _this.flame.table[i + 1] && _this.flame.table[i + 1][ii],
                );
            });
        });
    }
}
