import Global from '../../../../1/_global';
import _Stage from '../../interface/stage';

import Renderer from './layout/renderer';
import Scene from './layout/scene';
import Camera from './layout/camera';
import Panoramic from './component/panoramic';
import Loader from '../../controller/loader';
import Look from '../../controller/look';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private readonly resource: any = { // 资源
        path: [
            {
                name: 'image_universe',
                url: 'image/Panoramic/universe.jpg'
            },
            {
                name: 'cube_universe',
                url: [
                    'image/Panoramic/px.jpg',
                    'image/Panoramic/nx.jpg',
                    'image/Panoramic/py.jpg',
                    'image/Panoramic/ny.jpg',
                    'image/Panoramic/pz.jpg',
                    'image/Panoramic/nz.jpg'
                ]
            },
        ],
        data: null // 数据
    };
    private renderer: Renderer = null; // 渲染器
    private scene: Scene = null; // 场景
    private camera: Camera = null; // 相机
    private component: any = { // 组件
        panoramic: null as Panoramic // 全景
    };
    private controller: any = { // 控制器
        loader: null as Loader, // 加载
        look: null as Look // 观看
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
     * @return {void}
     */
    private create(): void {
        const _this = this,
            resource = _this.resource.data;
        
        _this.renderer = new Renderer();
        Global.$Root.append(_this.renderer.instance.domElement);
        
        _this.scene = new Scene();
        
        _this.camera = new Camera();
        
        _this.component.panoramic = new Panoramic(_this.scene, {
            image: resource.image_universe,
            cube: resource.cube_universe
        });
        
        _this.controller.look = new Look(_this.camera, {
            turn: true,
            focus: true
        });
    }
    
    /**
     * 初始化
     * @return {void}
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
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.isInit) return;
        
        _this.controller.look.update();
        
        _this.camera.update(isResize);
        _this.renderer.update(isResize);
        
        _this.renderer.instance.clear();
        _this.renderer.instance.render(
            _this.scene.instance,
            _this.camera.instance
        );
    }
}
