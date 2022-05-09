declare global {
    interface ENV { // 环境
        isProduction: boolean; // 是否是发布模式
        isFormal: boolean; // 是否是正式类型
        mode: 'development' | 'production'; // 模式
        type: 'test' | 'formal'; // 类型
    }
    
    const ENV: ENV; // 环境
}

export {};
