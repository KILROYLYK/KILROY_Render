import Global from '../../../../1/_global';
import _Stage from '../../interface/stage';

import Renderer from './layout/renderer';
import Scene from './layout/scene';
import Camera from './layout/camera';
import Light from './component/light';
import Wave from './component/wave';
import Ground from './component/ground';
import Car from './component/car';
import Loader from '../../controller/loader';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private readonly resource: any = { // 资源
        path: [
            {
                name: 'cube_bg',
                url: [
                    'image/Car/px.jpg',
                    'image/Car/nx.jpg',
                    'image/Car/py.jpg',
                    'image/Car/ny.jpg',
                    'image/Car/pz.jpg',
                    'image/Car/nz.jpg'
                ]
            },
            {
                name: 'json_car',
                url: 'json/Car/car.json'
            },
            {
                name: 'json_wheel_l1',
                url: 'json/Car/wheel.json'
            },
            {
                name: 'json_wheel_l2',
                url: 'json/Car/wheel.json'
            },
            {
                name: 'json_wheel_r1',
                url: 'json/Car/wheel.json'
            },
            {
                name: 'json_wheel_r2',
                url: 'json/Car/wheel.json'
            }
        ],
        data: null // 数据
    };
    private renderer: Renderer = null; // 渲染器
    private scene: Scene = null; // 场景
    private camera: Camera = null; // 相机
    private component: any = { // 组件
        light: null as Light, // 光源
        wave: null as Wave, // 波浪
        ground: null as Ground, // 地面
        car: null as Car // 车
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
        _this.scene.instance.background = resource.cube_bg;
        
        _this.camera = new Camera();
        
        _this.component.light = new Light(_this.scene);
        _this.component.wave = new Wave(_this.scene);
        _this.component.ground = new Ground(_this.scene);
        _this.component.car = new Car(_this.scene, {
            bg: resource.cube_bg,
            car: resource.json_car,
            wheel_l1: resource.json_wheel_l1,
            wheel_l2: resource.json_wheel_l2,
            wheel_r1: resource.json_wheel_r1,
            wheel_r2: resource.json_wheel_r2
        });
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
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.isInit) return;
        
        _this.component.light.update();
        _this.component.wave.update();
        _this.component.car.update();
        
        _this.camera.update(isResize);
        _this.renderer.update(isResize);
        
        _this.renderer.instance.clear();
        _this.renderer.instance.render(
            _this.scene.instance,
            _this.camera.instance
        );
    }
}
