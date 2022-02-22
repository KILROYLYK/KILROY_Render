// @ts-ignore
import Tween from '@tweenjs/tween.js';

import _Stage from '../../interface/stage';
import Global from '../../constant/_global';

import Renderer from './layout/renderer';
import Scene from './layout/scene';
import Camera from './layout/camera';
import Light from './component/light';
import Panoramic from './component/panoramic';
import Asteroid from './component/asteroid';
import Sun from './component/sun';
import Mercury from './component/planet/mercury';
import Venus from './component/planet/venus';
import Earth from './component/planet/earth';
import Moon from './component/satellite/moon';
import Mars from './component/planet/mars';
import Jupiter from './component/planet/jupiter';
import Saturn from './component/planet/saturn';
import Uranus from './component/planet/uranus';
import Neptune from './component/planet/neptune';
import Loader from '../../controller/loader';

/**
 * 场景
 * 知识点
 * 星球【太阳，水星，金星，地球，火星，木星，土星，天王星，海王星】
 * 半径【69.63，0.2440，0.6052，0.6371，0.3397，7.1492，6.0268，2.5559，2.4766】（万千米）
 * 半径比例【285，1，2.48，2.61，1.39，29.3，24.7，10.47，10.15】
 * 距离【5791，10820，14960，22794，77833，142940，287099，450400】（万千米）
 * 距离比例【1，1.86，2.58，3.93，13.44，24.68，49.57，77.77】
 * 他们的公转周期分别为【88，225，365，687，4329，10767，30769，60152】（天）
 * 他们的自转周期分别为【58，243，1，1，0.41，0.42，0.64，0.65】
 * 月球【0.1738】【36.3】（万千米）【0.7】【0.006】
 */
export default class Stage implements _Stage {
    public static readonly radiusM: number = 1; // 星球半径倍数
    public static readonly trackM: number = 200; // 轨迹半径倍数
    public static readonly trackIR: number = 5 * Stage.trackM; // 轨迹内圈半径
    
    private isInit: boolean = false; // 是否初始化
    private readonly resource: any = { // 资源
        path: [
            {
                name: 'image_universe',
                url: 'image/Solar/universe.jpg'
            },
            {
                name: 'image_asteroid',
                url: 'image/Solar/asteroid.png'
            },
            {
                name: 'image_sun',
                url: 'image/Solar/sun.jpg'
            },
            {
                name: 'image_sunGround',
                url: 'image/Solar/sun_ground.jpg'
            },
            {
                name: 'image_sunFire',
                url: 'image/Solar/sun_fire.png'
            },
            {
                name: 'image_mercury',
                url: 'image/Solar/mercury.jpg'
            },
            {
                name: 'image_venus',
                url: 'image/Solar/venus.jpg'
            },
            {
                name: 'image_earth',
                url: 'image/Solar/earth.jpg'
            },
            {
                name: 'image_earthSky',
                url: 'image/Solar/earth_sky.jpg'
            },
            {
                name: 'image_moon',
                url: 'image/Solar/moon.jpg'
            },
            {
                name: 'image_mars',
                url: 'image/Solar/mars.jpg'
            },
            {
                name: 'image_jupiter',
                url: 'image/Solar/jupiter.jpg'
            },
            {
                name: 'image_saturn',
                url: 'image/Solar/saturn.jpg'
            },
            {
                name: 'image_saturnRing',
                url: 'image/Solar/saturn_ring.png'
            },
            {
                name: 'image_uranus',
                url: 'image/Solar/uranus.jpg'
            },
            {
                name: 'image_neptune',
                url: 'image/Solar/neptune.jpg'
            }
        ],
        data: null // 数据
    };
    private renderer: Renderer = null; // 渲染器
    private scene: Scene = null; // 场景
    private camera: Camera = null; // 相机
    private component: any = { // 组件
        light: null as Light, // 光源
        panoramic: null as Panoramic, // 全景
        asteroid: null as Asteroid, // 小行星
        sun: null as Sun, // 太阳
        mercury: null as Mercury, // 水星
        venus: null as Venus, // 金星
        earth: null as Earth, // 地球
        moon: null as Moon, // 月球
        mars: null as Mars, // 火星
        jupiter: null as Jupiter, // 木星
        saturn: null as Saturn, // 土星
        uranus: null as Uranus, // 天王星
        neptune: null as Neptune, // 海王星
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
     * @return {void}
     */
    private create(): void {
        const resource = this.resource.data;
        
        this.renderer = new Renderer();
        Global.Root.append(this.renderer.instance.domElement);
        
        this.scene = new Scene();
        
        this.camera = new Camera();
        
        this.component.light = new Light(this.scene);
        this.component.panoramic = new Panoramic(this.scene, resource.image_universe);
        this.component.asteroid = new Asteroid(this.scene, resource.image_asteroid);
        
        this.component.sun = new Sun(this.scene, {
            sun: resource.image_sun,
            ground: resource.image_sunGround,
            fire: resource.image_sunFire
        });
        this.component.mercury = new Mercury(this.scene, resource.image_mercury);
        this.component.venus = new Venus(this.scene, resource.image_venus);
        this.component.earth = new Earth(this.scene, {
            earth: resource.image_earth,
            sky: resource.image_earthSky
        });
        this.component.moon = new Moon(this.component.earth.group, resource.image_moon);
        this.component.mars = new Mars(this.scene, resource.image_mars);
        this.component.jupiter = new Jupiter(this.scene, resource.image_jupiter);
        this.component.saturn = new Saturn(this.scene, {
            saturn: resource.image_saturn,
            ring: resource.image_saturnRing
        });
        this.component.uranus = new Uranus(this.scene, resource.image_uranus);
        this.component.neptune = new Neptune(this.scene, resource.image_neptune);
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
        
        Tween.update();
        
        this.component.asteroid.update();
        
        this.component.sun.update();
        this.component.mercury.update();
        this.component.venus.update();
        this.component.earth.update();
        this.component.moon.update();
        this.component.mars.update();
        this.component.jupiter.update();
        this.component.saturn.update();
        this.component.uranus.update();
        this.component.neptune.update();
        
        this.camera.update(isResize);
        this.renderer.update(isResize);
        
        this.renderer.instance.clear();
        this.renderer.instance.render(
            this.scene.instance,
            this.camera.instance
        );
    }
}
