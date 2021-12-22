import Global from '../../application/constant/_global';

declare global {
    interface Window {
        platform: any; // 旅法师营地App平台对接SDK
        setParametersByApp: Function; // 传递参数
        appGetShareInfo: Function; // 获取分享参数
        downloadimglistener: any; // 安卓客户端保存图片
    }
}

/**
 * 旅法师营地平台
 */
export default class LFSYDPlatform {
    public static userInfo: any = { // 用户信息
        token: '',
        userId: '0',
        preId: '',
        version: '',
        platform: '',
        traditional: false,
        callback: null // 更新用户信息回调
    };
    public static shareInfo: any = { // 分享信息
        title: '', // 标题
        description: '', // 简介
        image: '', // 图片
        url: window.location.href, // 地址
        callback: null // 获取分享信息回调
    };
    public static showCallback: Function = null; // 显示回调
    public static hideCallback: Function = null; // 隐藏回调
    
    /**
     * 登录
     * @param {string} token 登录标识
     * @param {string} preId 授权标识
     * @param {string} version 客户端版本
     * @param {string} platform 客户端平台
     * @param {string} userId 用户标识（文档里是number，但实际传的是字符串）
     * @param {string} useTraditional 使用繁体
     * @param {string} extJson 额外拓展参数
     */
    public static onLogin(token: string = '', preId: string = '', version: string = '', platform: string = '', userId: string = '0', useTraditional: string = '', extJson: string = '') {
        const _this = LFSYDPlatform;
        
        console.log("App触发-onLogin");
        
        _this.userInfo.token = token;
        _this.userInfo.userId = userId;
        _this.userInfo.preId = preId;
        _this.userInfo.version = version;
        _this.userInfo.platform = platform;
        _this.userInfo.traditional = useTraditional === 'yes';
        _this.userInfo.callback && _this.userInfo.callback();
    }
    
    /**
     * 显示
     */
    public static onShow(): void {
        const _this = LFSYDPlatform;
        
        console.log("App触发-onShow");
        _this.showCallback && _this.showCallback();
    }
    
    /**
     * 隐藏
     */
    public static onHide(): void {
        const _this = LFSYDPlatform;
        
        console.log("App触发-onHide");
        _this.hideCallback && _this.hideCallback();
    }
    
    /**
     * 分享
     */
    public static onShare(): string {
        const _this = LFSYDPlatform;
        
        _this.shareInfo.callback && _this.shareInfo.callback();
        
        return Global.Crypto.encryptBase64({
            title: _this.shareInfo.title,
            content: _this.shareInfo.description,
            image: _this.shareInfo.image,
            url: _this.shareInfo.url
        });
    }
    
    /**
     * 保存图片
     * @param {string} src 图片地址
     */
    public static onSaveImage(src: string): void {
        const _this = LFSYDPlatform;
        
        if (!window.downloadimglistener) return;
        window.downloadimglistener.downLoadImg(src);
    }
}

window.platform = LFSYDPlatform;
window.setParametersByApp = LFSYDPlatform.onLogin;
window.appGetShareInfo = LFSYDPlatform.onShare;
