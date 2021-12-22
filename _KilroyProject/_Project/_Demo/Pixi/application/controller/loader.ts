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
        const _this = this;
        
        _this.resourceList = resourceList;
        _this.total = _this.resourceList.length;
        _this.loaded = config.loaded || null;
        _this.finish = config.finish || null;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const _this = this;
        
        _this.loader = new PIXI.Loader();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.load();
    }
    
    /**
     * 加载素材
     */
    private load(): void {
        const _this = this,
            length = _this.resourceList.length;
        
        if (length === 0) {
            _this.loaded && _this.loaded(0, 0, 100);
            _this.finish && _this.finish(_this.dataList);
            return;
        }
        
        _this.loader
            .add(_this.resourceList)
            .use((resource: any, next: Function) => {
                _this.finishTotal++;
                _this.loaded && _this.loaded(
                    _this.finishTotal, length,
                    parseInt(String(_this.finishTotal / length * 100), 10)
                );
                next();
            })
            .load((loader: PIXI.Loader, dataList: Partial<Record<string, PIXI.LoaderResource>>) => {
                _this.dataList = dataList;
                _this.finish && _this.finish(_this.dataList);
            });
    }
}
