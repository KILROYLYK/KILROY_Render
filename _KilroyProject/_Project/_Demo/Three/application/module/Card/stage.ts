import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

import Renderer from './layout/renderer';
import Scene from './layout/scene';
import Camera from './layout/camera';
import Loader from '../../controller/loader';

import Card from './component/card';
import Skull from './component/skull';

/**
 * 场景
 */
export default class Stage implements _Stage {
    private isInit: boolean = false; // 是否初始化
    private readonly resource: any = { // 资源
        path: [
            {
                name: 'image_card_front',
                url: 'image/Card/card_front.png'
            },
            {
                name: 'image_card_back',
                url: 'image/Card/card_back.png'
            },
            {
                name: 'image_card_pattern',
                url: 'image/Card/card_pattern.png'
            },
            {
                name: 'image_color_1',
                url: 'image/Card/color_1.png'
            },
            {
                name: 'image_color_2',
                url: 'image/Card/color_2.jpg'
            },
            {
                name: 'image_noise_1',
                url: 'image/Card/noise_1.png'
            },
            {
                name: 'image_noise_2',
                url: 'image/Card/noise_2.png'
            },
            {
                name: 'obj_skull',
                url: 'model/Card/skull.obj'
            }
        ],
        data: null // 数据
    };
    private renderer: Renderer = null; // 渲染器
    private scene: Scene = null; // 场景
    private camera: Camera = null; // 相机
    private component: any = { // 组件
        skull: null as Skull, // 骷髅
        card: null as Card // 卡牌
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
                    console.log(`/////加载资源进度：${ index } ${ total } ${ progress }`);
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
        
        this.component.skull = new Skull({
            texture: {
                skull: resource.obj_skull
            }
        });
        this.component.card = new Card({
            renderer: this.renderer.instance,
            scene: this.scene.instance,
            camera: this.camera.instance,
            skull: this.component.skull,
            texture: {
                card_front: resource.image_card_front,
                card_back: resource.image_card_back,
                card_pattern: resource.image_card_pattern,
                color_1: resource.image_color_1,
                color_2: resource.image_color_2,
                noise_1: resource.image_noise_1,
                noise_2: resource.image_noise_2
            }
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
        
        this.component.skull.update(isResize);
        this.component.card.update(isResize);
        
        this.camera.update(isResize);
        this.renderer.update(isResize);
        
        this.renderer.instance.clear();
        this.renderer.instance.render(
            this.scene.instance,
            this.camera.instance
        );
    }
}
