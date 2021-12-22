import Global from '../../constant/_global';
import _Stage from '../../interface/stage';

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
        const _this = this;
        
        _this.controller.loader = new Loader(
            _this.resource.path,
            {
                loaded(index: number, total: number, progress: number): void {
                    // console.log(`加载进度：${ index } ${ total } ${ progress }`);
                },
                finish(data: any): void {
                    _this.resource.data = data;
                    console.log(data);
                    
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
        
        _this.component.skull = new Skull({
            texture: {
                skull: resource.obj_skull
            }
        });
        _this.component.card = new Card({
            renderer: _this.renderer.instance,
            scene: _this.scene.instance,
            camera: _this.camera.instance,
            skull: _this.component.skull,
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
        
        _this.component.skull.update(isResize);
        _this.component.card.update(isResize);
        
        _this.camera.update(isResize);
        _this.renderer.update(isResize);
        
        _this.renderer.instance.clear();
        _this.renderer.instance.render(
            _this.scene.instance,
            _this.camera.instance
        );
    }
}
