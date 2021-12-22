// @ts-ignore
import * as PIXI from 'pixi.js';

import Global from '../../constant/_global';
import _Stage from '../../interface/stage';

import Background from './component/background';
import Loader, { ResourceConfig } from '../../controller/loader';

import '../../../resource/css/Parallax/index.less';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private readonly resource: any = { // 资源
        path: [ // 地址
            {
                name: 'image_bg',
                url: 'image/Parallax/bg.jpg'
            },
            {
                name: 'image_bg_shadow',
                url: 'image/Parallax/bg_shadow.jpg'
            }
        ] as ResourceConfig[],
        data: null as any // 数据
    };
    private app: PIXI.Application = null; // 应用
    private container: PIXI.Container = null; // 容器
    private component: any = { // 组件
        background: null as Background // 背景
    };
    private controller: any = { // 控制器
        loader: null as Loader // 加载
    };
    
    /**
     * 构造函数
     * @constructor Stage
     */
    constructor() {
        const _this = this;
        
        _this.controller.loader = new Loader(
            _this.resource.path,
            {
                loaded(index: number, total: number, progress: number): void {
                    console.log(`加载进度：${ index } ${ total } ${ progress }`);
                },
                finish(data: any): void {
                    _this.resource.data = data;
                    
                    _this.create();
                    _this.init();
                }
            }
        );
    }
    
    /**
     * 创建
     */
    private create(): void {
        const _this = this,
            resource = _this.resource.data;
        
        _this.app = new PIXI.Application({
            width: Global.Width,
            height: Global.Height,
            backgroundColor: 0x222222,
            backgroundAlpha: 0,
            resizeTo: Global.$Root[0]
        });
        Global.$Root.append(_this.app.view);
        
        _this.container = new PIXI.Container();
        _this.app.stage.addChild(_this.container);
        
        _this.component.background = new Background(
            _this.container, {
                bg: resource.image_bg,
                bg_shadow: resource.image_bg_shadow,
            });
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.isInit = true;
        
        Global.Function.showCursor(false);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.isInit) return;
        
        // _this.component.background.update(isResize);
    }
}
