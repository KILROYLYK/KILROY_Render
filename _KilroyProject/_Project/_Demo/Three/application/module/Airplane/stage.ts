// @ts-ignore
import Tween from '/usr/local/lib/node_modules/@tweenjs/tween.js';

import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

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
        this.controller.loader = new Loader(
            this.resource.path,
            {
                loaded: (index: number, total: number, progress: number): void => {
                    // console.log(`加载进度：${ index } ${ total } ${ progress }`);
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
        this.renderer = new Renderer();
        Global.Root.append(this.renderer.instance.domElement);
        
        this.scene = new Scene();
        
        this.camera = new Camera();
        
        this.component.light = new Light(this.scene);
        this.component.weather = new Weather(this.scene);
        this.component.ground = new Ground(this.scene);
        this.component.cloud = new Cloud(this.scene);
        this.component.plant = new Plant(this.scene);
        this.component.airplane = new Airplane(this.scene);
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.isInit = true;
        
        Global.Function.Resize(() => {
            this.update(true);
        });
        Global.FN.updateFrame(() => {
            this.update();
        });
        Global.FN.showCursor(false);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        if (!this.isInit) return;
        
        Tween.update();
        
        this.component.weather.update();
        this.component.ground.update();
        this.component.cloud.update();
        this.component.plant.update();
        this.component.airplane.update();
        
        this.camera.update(isResize);
        
        this.renderer.update(isResize);
        this.renderer.instance.clear();
        this.renderer.instance.render(
            this.scene.instance,
            this.camera.instance
        );
    }
}
