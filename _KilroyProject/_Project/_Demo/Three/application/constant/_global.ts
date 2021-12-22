import _Global from '../../../../_Base/Asset/_Global/_global';

import './style';
import GlobalConfig from './config'; // 配置
import GlobalFunction from './function'; // 函数
import GlobalStage from './stage'; // 场景

export interface Vector { // 向量
    x: number, // X轴
    y: number // Y轴
}

/**
 * 全局
 */
export default class Global {
    public static readonly $: typeof _Global.$ = _Global.$;
    
    public static readonly Window: Window = _Global.Window;
    public static readonly Document: Document = _Global.Document;
    public static readonly Body: HTMLElement = _Global.Body;
    public static readonly $Window: typeof Global.$ = _Global.$Window;
    public static readonly $Document: typeof Global.$ = _Global.$Document;
    public static readonly $Body: typeof Global.$ = _Global.$Body;
    
    public static readonly FN: typeof _Global.FN = _Global.FN;
    public static readonly Algorithm: typeof _Global.Algorithm = _Global.Algorithm;
    public static readonly Adaptation: typeof _Global.Adaptation = _Global.Adaptation;
    public static readonly Crypto: typeof _Global.Crypto = _Global.Crypto;
    public static readonly Ajax: typeof _Global.Ajax = _Global.Ajax;
    
    public static readonly Share: typeof _Global.Share = _Global.Share;
    public static readonly Authorize: typeof _Global.Authorize = _Global.Authorize;
    
    public static readonly Console: typeof _Global.Console = _Global.Console;
    public static readonly Stats: typeof _Global.Stats = _Global.Stats;
    public static readonly GUI: typeof _Global.GUI = _Global.GUI;
    
    public static Width: number = Global.$Window.width();
    public static Height: number = Global.$Window.height();
    public static Aspect: number = Global.Width / Global.Height;
    public static readonly $Application: typeof Global.$ = GlobalFunction.getApplication();
    public static readonly $Root: typeof Global.$ = Global.$Application.children('.container');
    public static Center: Vector = { // 中心
        x: Global.$Root.width() / 2,
        y: Global.$Root.height() / 2
    };
    public static Focus: Vector = Global.Center; // 焦点
    
    public static readonly Config: typeof GlobalConfig = GlobalConfig; // 配置
    public static readonly Function: typeof GlobalFunction = GlobalFunction; // 函数
    public static readonly Stage: typeof GlobalStage = GlobalStage; // 场景
}
