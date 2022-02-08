import { Vector2, Vector3 } from '../interface/public';
import Global from './_global';

/**
 * 函数
 */
export default class FN {
    /**
     * 获取Application节点
     * @return {Element} 节点
     */
    public static getApplication(): Element {
        const id = 'application',
            domContainer = document.createElement('div');
        
        let domApplication = document.getElementById(id);
        
        domApplication && document.body.removeChild(domApplication);
        domApplication = document.createElement('div');
        domApplication.id = id;
        domApplication.classList.add(id);
        domContainer.classList.add('container');
        domApplication.prepend(domContainer);
        document.body.prepend(domApplication);
        
        return domApplication;
    }
    
    /**
     * 获取节点宽高比
     * @param {Element} dom 节点
     * @return {number} 宽高比
     */
    public static getDomAspect(dom?: Element): number {
        return dom
            ? dom.clientWidth / dom.clientHeight
            : Global.Root.clientWidth / Global.Root.clientHeight;
    }
    
    /**
     * 获取中心位置
     * @param {Element} dom 节点
     * @return {*} 中心位置
     */
    public static getDomCenter(dom?: Element): Vector2 {
        return dom
            ? {
                x: dom.clientWidth / 2,
                y: dom.clientHeight / 2
            }
            : {
                x: Global.Root.clientWidth / 2,
                y: Global.Root.clientHeight / 2
            };
    }
    
    /**
     * 更新焦点
     * @param {boolean} isReset 是否重置
     */
    public static updateFocus(isReset: boolean = true): void {
        // Mouse
        addEventListener('mousemove', (e: MouseEvent) => {
            Global.Focus.x = e.clientX;
            Global.Focus.y = e.clientY;
        });
        
        // Touch
        addEventListener('touchstart', (e: TouchEvent) => {
            Global.Focus.x = e.touches[0].clientX;
            Global.Focus.y = e.touches[0].clientY;
        });
        addEventListener('touchmove', (e: TouchEvent) => {
            Global.Focus.x = e.touches[0].clientX;
            Global.Focus.y = e.touches[0].clientY;
        });
        
        if (isReset) {
            addEventListener('mouseout', (e: MouseEvent) => {
                const center = FN.getDomCenter();
                Global.Focus.x = center.x;
                Global.Focus.y = center.y;
            });
            addEventListener('touchend', (e: TouchEvent) => {
                const center = FN.getDomCenter();
                Global.Focus.x = center.x;
                Global.Focus.y = center.y;
            });
        }
    }
    
    /**
     * 更新帧
     * @param {function} callback 回调
     * @param {number} frame 帧（0时使用动画帧模式）
     */
    public static updateFrame(callback: Function, frame: number = 0): void {
        if (!callback) return;
        
        callback();
        if (frame > 0) {
            setInterval(() => {
                callback();
            }, 1000 / frame);
        } else {
            requestAnimationFrame(() => {
                FN.updateFrame(callback);
            });
        }
    }
    
    /**
     * 设置缓冲效果
     * @param {*} position 当前位置
     * @param {*} targetP 目标位置
     * @param {number} ease 缓冲系数
     */
    public static setEase(position: Vector3, targetP: Vector3, ease: number): void {
        position.x += (targetP.x - position.x) / ease;
        position.y += (targetP.y - position.y) / ease;
        position.z += (targetP.z - position.z) / ease;
    }
    
    /**
     * 显示鼠标
     * @param {boolean} show 显示
     */
    public static showCursor(show: boolean = true): void {
        document.body.style.cursor = show ? 'default' : 'none';
    }
}
