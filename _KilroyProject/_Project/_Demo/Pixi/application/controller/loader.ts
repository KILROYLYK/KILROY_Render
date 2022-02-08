// @ts-ignore
import * as PIXI from 'pixi.js';
import 'pixi-sound';

import Controller from '../interface/controller';

export interface ResourceConfig { // 资源配置
    name: string; // 名称
    url: string; // 地址
    crossOrigin?: boolean; // 是否跨域
    onComplete?(): void; // 单文件完成回调
}

export interface LoadConfig { // 加载配置
    loaded?(index: number, total: number, progress: number): void; // 加载完成（单个资源）
    finish?(data: any): void; // 加载完成（全部资源）
}

/**
 * 加载
 */
export default class Loader implements Controller {
    private loader: PIXI.Loader = null; // 加载器对象
    private resourceList: ResourceConfig[] = []; // 资源列表
    private dataList: any = {}; // 数据列表
    private total: number = 0; // 资源总数
    private finishTotal: number = 0; // 完成总数
    private loaded: Function = null; // 加载完成（单个资源）
    private finish: Function = null; // 加载完成（全部资源）
    
    /**
     * 原型对象
     * @constructor Loader
     * @param {ResourceConfig[]} resourceList 资源列表
     * @param {LoadConfig} config 配置
     */
    constructor(resourceList: ResourceConfig[] = [], config: LoadConfig = {}) {
        this.resourceList = resourceList;
        this.total = this.resourceList.length;
        this.loaded = config.loaded || null;
        this.finish = config.finish || null;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        this.loader = new PIXI.Loader();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.load();
    }
    
    /**
     * 加载素材
     */
    private load(): void {
        const length = this.resourceList.length;
        
        if (length === 0) {
            this.loaded && this.loaded(0, 0, 100);
            this.finish && this.finish(this.dataList);
            return;
        }
        
        this.loader
            .add(this.resourceList)
            .use((resource: any, next: Function) => {
                this.finishTotal++;
                this.loaded && this.loaded(
                    this.finishTotal, length,
                    parseInt(String(this.finishTotal / length * 100), 10)
                );
                next();
            })
            .load((loader: PIXI.Loader, dataList: Partial<Record<string, PIXI.LoaderResource>>) => {
                this.dataList = dataList;
                this.finish && this.finish(this.dataList);
            });
    }
}
