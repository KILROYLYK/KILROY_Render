// @ts-ignore
import * as PIXI from 'pixi.js';

import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

import Background from './component/background';
import Loader, { ResourceConfig } from '../../controller/loader';

import '../../../resource/css/Parallax/index.less';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private readonly resource = { // 资源
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
        this.controller.loader = new Loader(
            this.resource.path,
            {
                loaded: (index: number, total: number, progress: number): void => {
                    console.log(`加载进度：${ index } ${ total } ${ progress }`);
                },
                finish: (data: any): void => {
                    this.resource.data = data;
                    
                    this.create();
                    this.init();
                }
            }
        );
    }
    
    /**
     * 创建
     */
    private create(): void {
        const resource = this.resource.data;
        
        this.app = new PIXI.Application({
            width: Global.Root.clientWidth,
            height: Global.Root.clientHeight,
            backgroundColor: 0x222222,
            backgroundAlpha: 0,
            resizeTo: Global.Root
        });
        
        Global.Root.append(this.app.view);
        
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        
        this.component.background = new Background(
            this.container, {
                bg: resource.image_bg,
                bg_shadow: resource.image_bg_shadow,
            });
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.isInit = true;
        
        Global.FN.showCursor(false);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        if (!this.isInit) return;
        
        // this.component.background.update(isResize);
    }
}
