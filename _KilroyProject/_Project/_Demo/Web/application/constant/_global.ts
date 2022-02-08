import _Global from '../../../../_Base/Asset/_Global/_global';

import { Vector2 } from '../interface/_public';
import Config from './config';
import FN from './function';
import Stage from './stage';

import './style';

/**
 * 全局
 */
export default class Global {
    public static readonly Function: typeof _Global.Function = _Global.Function;
    public static readonly Algorithm: typeof _Global.Algorithm = _Global.Algorithm;
    public static readonly Crypto: typeof _Global.Crypto = _Global.Crypto;
    
    public static readonly Adaptation: typeof _Global.Adaptation = _Global.Adaptation;
    
    public static readonly Console: typeof _Global.Console = _Global.Console;
    public static readonly Stats: typeof _Global.Stats = _Global.Stats;
    public static readonly GUI: typeof _Global.GUI = _Global.GUI;
    
    public static readonly Application: Element = FN.getApplication();
    public static readonly Root: Element = Global.Application.getElementsByClassName('container')[0];
    public static Width: number = document.body.clientWidth;
    public static Height: number = document.body.clientHeight;
    public static Aspect: number = Global.Width / Global.Height;
    public static Center: Vector2 = { x: 0, y: 0 }; // 中心
    public static Focus: Vector2 = { x: 0, y: 0 }; // 焦点
    
    public static readonly Config: typeof Config = Config; // 配置
    public static readonly FN: typeof FN = FN; // 函数
    public static readonly Stage: typeof Stage = Stage; // 场景
}
