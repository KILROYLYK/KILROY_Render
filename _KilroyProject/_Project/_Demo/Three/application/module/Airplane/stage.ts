// @ts-ignore
import Tween from '/usr/local/lib/node_modules/@tweenjs/tween.js';

import Global from '../../../../1/_global';
import _Stage from '../../interface/stage';

import Renderer from './layout/renderer';
import Scene from './layout/scene';
import Camera from './layout/camera';
import Light from './component/light';
import Weather from './component/weather';
import Ground from './component/ground';
import Cloud from './component/cloud';
import Plant from './component/plant';
import Airplane from './component/airplane';
import Loader from '../../controller/loader';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private readonly resource: any = { // 资源
        path: [],
        data: null // 数据
    };
    private renderer: Renderer = null; // 渲染器
    private scene: Scene = null; // 场景
    private camera: Camera = null; // 相机
    private component: any = { // 组件
        light: null as Light, // 灯光
        weather: null as Weather, // 太阳
        ground: null as Ground, // 地面
        cloud: null as Cloud, // 云
        plant: null as Plant, // 植物
        airplane: null as Airplane // 飞机
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
                    // console.log(`加载进度：${ index } ${ total } ${ progress }`);
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
        
        _this.renderer = new Renderer();
        Global.$Root.append(_this.renderer.instance.domElement);
        
        _this.scene = new Scene();
        
        _this.camera = new Camera();
        
        _this.component.light = new Light(_this.scene);
        _this.component.weather = new Weather(_this.scene);
        _this.component.ground = new Ground(_this.scene);
        _this.component.cloud = new Cloud(_this.scene);
        _this.component.plant = new Plant(_this.scene);
        _this.component.airplane = new Airplane(_this.scene);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.isInit = true;
        
        Global.FN.resize(() => {
            _this.update(true);
        });
        Global.Function.updateFrame(() => {
            _this.update();
        });
        Global.Function.showCursor(false);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.isInit) return;
        
        Tween.update();
        
        _this.component.weather.update();
        _this.component.ground.update();
        _this.component.cloud.update();
        _this.component.plant.update();
        _this.component.airplane.update();
        
        _this.camera.update(isResize);
        
        _this.renderer.update(isResize);
        _this.renderer.instance.clear();
        _this.renderer.instance.render(
            _this.scene.instance,
            _this.camera.instance
        );
    }
}
