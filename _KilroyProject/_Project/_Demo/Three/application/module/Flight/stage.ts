import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

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
        this.controller.loader = new Loader(this.resource.path, {
            loaded: (index: number, total: number, progress: number): void => {
                // console.log(`加载进度：${ index } ${ total } ${ progress }`);
            },
            finish: (data: any): void => {
                this.resource.data = data;
                
                this.create();
                this.init();
            }
        });
    }
    
    /**
     * 创建
     */
    private create(): void {
        const resource = this.resource.data;
        
        this.renderer = new Renderer();
        Global.Root.append(this.renderer.instance.domElement);
        
        this.scene = new Scene();
        
        this.camera = new Camera();
        
        this.component.mountain = new Mountain(this.scene, resource.image_mountain);
        this.component.ground = new Ground(this.scene);
        this.component.star = new Star(this.scene, resource.image_star);
        this.component.meteor = new Meteor(this.scene);
        this.component.spaceship = new Spaceship(this.scene, {
            engine: resource.image_engine,
            spaceship: resource.obj_spaceship
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
        Global.FN.showCursor(false);
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        if (!this.isInit) return;
        
        this.component.mountain.update();
        this.component.ground.update();
        this.component.star.update();
        this.component.meteor.update();
        this.component.spaceship.update();
        
        this.camera.update(isResize);
        this.renderer.update(isResize);
        
        this.renderer.instance.clear();
        this.renderer.instance.render(
            this.scene.instance,
            this.camera.instance
        );
    }
}
