import Global from '../../constant/_global';
import _Stage from '../../interface/stage';

import Renderer from './layout/renderer';
import Scene from './layout/scene';
import Camera from './layout/camera';
import Mountain from './component/mountain';
import Ground from './component/ground';
import Star from './component/star';
import Meteor from './component/meteor';
import Spaceship from './component/spaceship';
import Loader from '../../controller/loader';

import '../../../resource/css/Flight/index.less';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private readonly resource: any = { // 资源
        path: [
            {
                name: 'image_star',
                url: 'image/Flight/star.png'
            },
            {
                name: 'image_mountain',
                url: 'image/Flight/mountain.jpg'
            },
            {
                name: 'image_engine',
                url: 'image/Flight/engine.jpg'
            },
            {
                name: 'obj_spaceship',
                url: 'model/Flight/ship_03.obj'
            }
        ],
        data: null // 数据
    };
    private renderer: Renderer = null; // 渲染器
    private scene: Scene = null; // 场景
    private camera: Camera = null; // 相机
    private component: any = { // 组件
        mountain: null as Mountain, // 山脉
        ground: null as Ground, // 地形
        star: null as Star, // 星星
        meteor: null as Meteor, // 流星
        spaceship: null as Spaceship // 飞船
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
        
        _this.controller.loader = new Loader(_this.resource.path, {
            loaded(index: number, total: number, progress: number): void {
                // console.log(`加载进度：${ index } ${ total } ${ progress }`);
            },
            finish(data: any): void {
                _this.resource.data = data;
                
                _this.create();
                _this.init();
            }
        });
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
        
        _this.component.mountain = new Mountain(_this.scene, resource.image_mountain);
        _this.component.ground = new Ground(_this.scene);
        _this.component.star = new Star(_this.scene, resource.image_star);
        _this.component.meteor = new Meteor(_this.scene);
        _this.component.spaceship = new Spaceship(_this.scene, {
            engine: resource.image_engine,
            spaceship: resource.obj_spaceship
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
        Global.Function.showCursor(false);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        const _this = this;
        
        if (!_this.isInit) return;
        
        _this.component.mountain.update();
        _this.component.ground.update();
        _this.component.star.update();
        _this.component.meteor.update();
        _this.component.spaceship.update();
        
        _this.camera.update(isResize);
        _this.renderer.update(isResize);
        
        _this.renderer.instance.clear();
        _this.renderer.instance.render(
            _this.scene.instance,
            _this.camera.instance
        );
    }
}
