import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

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
        const resource = this.resource.data;
        
        this.renderer = new Renderer();
        Global.Root.append(this.renderer.instance.domElement);
        
        this.scene = new Scene();
        this.scene.instance.background = resource.cube_bg;
        
        this.camera = new Camera();
        
        this.component.light = new Light(this.scene);
        this.component.wave = new Wave(this.scene);
        this.component.ground = new Ground(this.scene);
        this.component.car = new Car(this.scene, {
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
        this.isInit = true;
        
        Global.Function.Resize(() => {
            this.update(true);
        });
        Global.FN.updateFrame(() => {
            this.update();
        });
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        if (!this.isInit) return;
        
        this.component.light.update();
        this.component.wave.update();
        this.component.car.update();
        
        this.camera.update(isResize);
        this.renderer.update(isResize);
        
        this.renderer.instance.clear();
        this.renderer.instance.render(
            this.scene.instance,
            this.camera.instance
        );
    }
}
