import Component from '../../../interface/component';
import Global from '../../../constant/_global';

export interface ParticleConfig { // 粒子配置
    show: boolean // 显示
    position: any // 当前位置
    target: any // 目标位置
    speed: any // 速度
    color: number // 颜色
    opacity: number // 不透明度
    radius: number // 半径
    direction: number // 方向 1 | -1
}

/**
 * 粒子
 */
export default class Particle implements Component {
    private context: CanvasRenderingContext2D = null; // 语境
    
    private text: string = ''; // 文案
    private readonly size: number = 150; // 字体大小
    private readonly density: number = 3; // 密度（越大越稀疏）
    private readonly color: string[] = [ // 颜色列表（RGB）
        '255,255,255',
        '151,19,55',
        '0,72,255',
        '136,0,255',
        '255,237,0'
    ];
    private readonly colorS: number = 0.05; // 颜色变化速度
    private readonly radius: any = { // 半径变化
        min: 1,
        max: 3,
        speed: 0.5
    };
    private readonly mouse: any = { // 鼠标
        radius: 50, // 推离半径
        speed: 100 // 鼠标推动速度（越大速度越慢）
    };
    private readonly interval: number = 300; // 运动间隔
    private readonly restoreS: number = 10; // 恢复速度
    private list: ParticleConfig[] = []; // 点列表
    
    /**
     * 构造函数
     * @constructor Particle
     * @param {CanvasRenderingContext2D} context 语境
     */
    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
    }
    
    /**
     * 初始化
     */
    private init(): void {
    }
    
    /**
     * 更新
     * @param {boolean} isResize 是否调整大小
     */
    public update(isResize: boolean = false): void {
        this.clearCanvas();
        
        for (let i = 0, n = this.list.length; i < n; i++) {
            const point = this.list[i];
            this.updatePoint(point);
            this.drawPoint(point);
            if (!point.show && point.opacity === 0) {
                const index = this.list.indexOf(point);
                this.list.splice(index, 1);
                i--;
                n--;
            }
        }
        
        if (isResize) {
            this.writeText(this.text);
        }
    }
    
    /**
     * 清理画布
     */
    private clearCanvas(): void {
        this.context.clearRect(0, 0, Global.Root.clientWidth, Global.Root.clientHeight);
    }
    
    /**
     * 写入文案
     * @param {string} text 文案
     */
    public writeText(text: string): void {
        const width = Global.Root.clientWidth,
            height = Global.Root.clientHeight,
            center = Global.FN.getDomCenter(),
            cList = this.list,
            list = [] as any[];
        
        this.clearCanvas();
        
        this.text = text;
        this.context.fillStyle = '#ffffff';
        this.context.font = `${ this.size }px Times`;
        this.context.fillText(
            text,
            center.x - this.context.measureText(text).width / 2,
            center.y + this.size / 4,
        );
        
        // 获取画布数据
        const data = this.context.getImageData(0, 0, width, height).data;
        
        for (let i = 0; i < data.length; i += this.density) {
            if (data[i] !== 0 && ~~(Math.random() * 5) === 1) {
                if (data[i + 4] !== 255 ||
                    data[i - 4] !== 255 ||
                    data[i + width * 4] !== 255 ||
                    data[i - width * 4] !== 255) {
                    
                    const target = {
                        x: (i / 4) % width,
                        y: ~~((i / 4) / width)
                    };
                    
                    list.push(this.createPoint(target));
                }
            }
        }
        
        const cListL = cList.length,
            listL = list.length;
        if (cListL === 0) {
            this.list = list;
        } else if (cListL === listL) {
            this.list.forEach((v: ParticleConfig, i: number, a: ParticleConfig[]) => {
                v.target = list[i].target;
            });
        } else if (cListL < listL) {
            list.sort(() => {
                return 0.5 - Math.random();
            });
            list.forEach((v: ParticleConfig, i: number, a: ParticleConfig[]) => {
                cList[i] && (cList[i].target = v.target);
            });
            this.list = cList.concat(list.slice(cListL, listL - 1));
        } else if (cListL > listL) {
            cList.sort(() => {
                return 0.5 - Math.random();
            });
            cList.forEach((v: ParticleConfig, i: number, a: ParticleConfig[]) => {
                if (list[i]) {
                    v.target = list[i].target;
                } else {
                    v.show = false;
                    v.target = {
                        x: Math.random() * width,
                        y: Math.random() * height
                    };
                }
            });
        }
    }
    
    /**
     * 获取两点之间距离
     * @param {*} position 双坐标对象
     * @return {number} 距离
     */
    private getDistance(position: any): number {
        return Math.sqrt(
            Math.pow((position.x2 - position.x1), 2) +
            Math.pow((position.y2 - position.y1), 2)
        );
    }
    
    /**
     * 创建点
     * @param {*} target 目标位置
     */
    private createPoint(target: any): ParticleConfig {
        const sign = [ 1, -1 ]; // 放大或缩小
        
        return {
            show: true,
            position: {
                x: Math.random() * Global.Root.clientWidth,
                y: Math.random() * Global.Root.clientHeight
            },
            target,
            speed: {
                x: 0,
                y: 0
            },
            color: ~~(Math.random() * this.color.length),
            opacity: 0,
            radius: this.radius.max - Math.random() * this.radius.min,
            direction: sign[~~(Math.random() * 2)] * Math.random() / 10
        }
    }
    
    /**
     * 绘制点
     * @param {ParticleConfig} point 点
     */
    private drawPoint(point: ParticleConfig): void {
        this.context.beginPath();
        this.context.fillStyle = `rgba(${ this.color[point.color] },${ point.opacity })`;
        this.context.arc(
            point.position.x,
            point.position.y,
            point.radius,
            0,
            Math.PI * 2,
            false);
        this.context.fill();
    }
    
    /**
     * 更新点
     * @param {ParticleConfig} point 点
     */
    private updatePoint(point: ParticleConfig): void {
        const mouseX = Global.Focus.x,
            mouseY = Global.Focus.y,
            distance = this.getDistance({
                x1: point.position.x,
                y1: point.position.y,
                x2: mouseX,
                y2: mouseY
            });
        
        // 颜色
        point.show
            ? point.opacity += this.colorS
            : point.opacity -= this.colorS;
        (point.opacity > 1) && (point.opacity = 1);
        (point.opacity < 0) && (point.opacity = 0);
        
        // 半径
        point.radius += point.direction * this.radius.speed;
        (point.radius >= this.radius.max) && (point.direction *= -1);
        (point.radius <= 1) && (point.direction *= -1);
        
        // 速度
        point.speed.x = (point.position.x - point.target.x) / this.interval;
        point.speed.y = (point.position.y - point.target.y) / this.interval;
        
        // 鼠标推动约束
        if (distance < this.mouse.radius) {
            point.speed.x += point.speed.x - (point.position.x - mouseX) / this.mouse.speed;
            point.speed.y += point.speed.y - (point.position.y - mouseY) / this.mouse.speed;
        }
        
        // 更新位置
        point.position.x -= point.speed.x * this.restoreS;
        point.position.y -= point.speed.y * this.restoreS;
    }
}
