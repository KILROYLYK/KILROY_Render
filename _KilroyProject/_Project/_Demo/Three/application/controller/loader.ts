import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import Controller from '../interface/controller';

export interface ResourceConfig { // 资源配置
    name: string; // 名称
    url: string | string[]; // 地址
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
    private readonly loader: any = { // 加载器对象
        image: null as THREE.TextureLoader,
        cube: null as THREE.CubeTextureLoader,
        // font: null as THREE.FontLoader,
        json: null as THREE.ObjectLoader,
        audio: null as THREE.AudioLoader,
        svg: null as SVGLoader,
        obj: null as OBJLoader,
        mtl: null as MTLLoader,
        fbx: null as FBXLoader
    };
    private resourceList: ResourceConfig[] = []; // 资源列表
    private dataList: any = {}; // 数据列表
    private total: number = 0; // 资源总数
    private finishTotal: number = 0; // 完成总数
    private loaded: Function = null; // 加载完成（单个资源）
    private finish: Function = null; // 加载完成（全部资源）
    
    /**
     * 构造函数
     * @constructor Loader
     * @param {ResourceConfig[]} resourceList 资源列表
     * @param {LoadConfig} config 配置
     */
    constructor(resourceList: ResourceConfig[], config: LoadConfig = {}) {
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
     * @return {void}
     */
    private create(): void {
        const _this = this;
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private async init(): Promise<any> {
        const _this = this,
            promiseList = [] as any[];
        
        _this.resourceList.forEach((v, i, a) => {
            promiseList.push(v.url ? _this.load(v) : Promise.resolve());
        });
        
        await Promise.all(promiseList);
        
        _this.finish && _this.finish(_this.dataList);
    }
    
    /**
     * 加载
     * @param {ResourceConfig} resource 地址
     * @return {void}
     */
    private async load(resource: ResourceConfig): Promise<any> {
        const _this = this,
            name = resource.name,
            url = resource.url,
            onComplete = resource.onComplete;
        
        let loader = null as any,
            type = '';
        
        if (name.indexOf('image_') > -1) { // 图片
            type = 'Image';
            !_this.loader.image &&
            (_this.loader.image = new THREE.TextureLoader());
            loader = _this.loader.image;
        } else if (name.indexOf('cube_') > -1) { // 图片
            type = 'Cube';
            !_this.loader.cube &&
            (_this.loader.cube = new THREE.CubeTextureLoader());
            loader = _this.loader.cube;
        } else if (name.indexOf('font_') > -1) { // 字体
            // type = 'Font';
            // !_this.loader.font &&
            // (_this.loader.font = new THREE.FontLoader());
            // loader = _this.loader.font;
        } else if (name.indexOf('json_') > -1) { // 模型
            type = 'Json';
            !_this.loader.json &&
            (_this.loader.json = new THREE.ObjectLoader());
            loader = _this.loader.json;
        } else if (name.indexOf('audio_') > -1) {
            type = 'Audio';
            !_this.loader.audio &&
            (_this.loader.audio = new THREE.AudioLoader());
            loader = _this.loader.audio;
        } else if (name.indexOf('svg_') > -1) {
            type = 'SVG';
            !_this.loader.svg &&
            (_this.loader.svg = new SVGLoader());
            loader = _this.loader.svg;
        } else if (name.indexOf('obj_') > -1) {
            type = 'OBJ';
            !_this.loader.obj &&
            (_this.loader.obj = new OBJLoader());
            loader = _this.loader.obj;
        } else if (name.indexOf('mtl_') > -1) {
            type = 'MTL';
            !_this.loader.mtl &&
            (_this.loader.mtl = new MTLLoader());
            loader = _this.loader.mtl;
        } else if (name.indexOf('fbx_') > -1) {
            type = 'FBX';
            !_this.loader.fbx &&
            (_this.loader.fbx = new FBXLoader());
            loader = _this.loader.fbx;
        }
        
        if (type === '') return Promise.resolve();
        
        return new Promise((resolve: Function, reject: Function) => {
            loader.load(url,
                (object: any) => { // 加载完成
                    _this.dataList[name] = object;
                    _this.finishTotal++;
                    onComplete && onComplete();
                    _this.loaded && _this.loaded(
                        _this.finish, _this.total,
                        parseInt(String(_this.finishTotal / _this.total * 100), 10)
                    );
                    resolve();
                },
                (xhr: XMLHttpRequest) => { // 加载进度
                },
                (error: any) => { // 加载失败
                    _this.dataList[name] = '';
                    console.log(`${ type }加载错误：名称-${ name }`);
                    resolve();
                }
            );
        });
    }
}
