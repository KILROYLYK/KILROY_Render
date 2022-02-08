import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

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
     * @return {void}
     */
    private create(): void {
        const resource = this.resource.data;
        
        this.renderer = new Renderer();
        Global.Root.append(this.renderer.instance.domElement);
        
        this.scene = new Scene();
        
        this.camera = new Camera();
        
        this.component.panoramic = new Panoramic(this.scene, {
            image: resource.image_universe,
            cube: resource.cube_universe
        });
        
        this.controller.look = new Look(this.camera, {
            turn: true,
            focus: true
        });
    }
    
    /**
     * 初始化
     * @return {void}
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
     * @return {void}
     */
    public update(isResize: boolean = false): void {
        if (!this.isInit) return;
        
        this.controller.look.update();
        
        this.camera.update(isResize);
        this.renderer.update(isResize);
        
        this.renderer.instance.clear();
        this.renderer.instance.render(
            this.scene.instance,
            this.camera.instance
        );
    }
}
