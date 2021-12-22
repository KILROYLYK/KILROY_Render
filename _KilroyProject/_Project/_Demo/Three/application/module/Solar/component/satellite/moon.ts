import * as THREE from 'three';

import Component from '../../../../interface/component';

/**
 * 月球
 */
export default class Moon implements Component {
    private readonly name: string = 'Moon-月球';
    
    private group: THREE.Group = null; // 场景
    private texture: THREE.Texture = null; // 纹理
    
    private readonly radius: number = 7; // 半径
    private readonly trackR: number = 26.1 + 70; // 轨迹半径
    private cycle: number = 0; // 周期
    private track: THREE.Mesh = null; // 轨道
    private planet: THREE.Mesh = null; // 星球
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Moon
     * @param {THREE.Group} group 场景
     * @param {THREE.Texture} texture 纹理
     */
    constructor(group: THREE.Group, texture: THREE.Texture) {
        const _this = this;
        
        _this.group = group;
        _this.texture = texture;
        
        _this.create();
        _this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const _this = this;
        
        _this.instance = new THREE.Group();
        _this.instance.name = _this.name;
        _this.instance.position.set(0, 0, 0);
        _this.instance.rotation.set(-Math.PI / 5, 0, 0);
        
        _this.createTrack();
        _this.createPlanet();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        const _this = this;
        
        _this.instance.add(_this.track);
        _this.instance.add(_this.planet);
        _this.group.add(_this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const _this = this,
            cycleS = 0.01; // 周期速度
        
        if (!_this.instance) return;
        
        _this.cycle += -cycleS;
        
        _this.planet.position.x = Math.cos(_this.cycle) * _this.trackR;
        _this.planet.position.z = Math.sin(_this.cycle) * _this.trackR;
        _this.planet.rotateY(cycleS);
    }
    
    /**
     * 创建轨道
     */
    private createTrack(): void {
        const _this = this;
        
        const geometry = new THREE.RingGeometry(
            _this.trackR - 1, _this.trackR, 64
        );
        
        const material = new THREE.MeshBasicMaterial({
            color: '#ffffff',
            side: THREE.DoubleSide
        });
        
        _this.track = new THREE.Mesh(geometry, material);
        _this.track.rotation.set(Math.PI / 2, 0, 0);
    }
    
    /**
     * 创建星球
     */
    private createPlanet(): void {
        const _this = this,
            texture = _this.texture;
        
        texture.anisotropy = 4;
        texture.encoding = THREE.sRGBEncoding;
        
        const geometry = new THREE.SphereBufferGeometry(
            _this.radius, 32, 32
        );
        
        const material = new THREE.MeshStandardMaterial({
            map: _this.texture,
            roughness: 1
        });
        
        _this.planet = new THREE.Mesh(geometry, material);
        _this.planet.position.set(0, 0, _this.trackR);
        _this.planet.castShadow = true;
        _this.planet.receiveShadow = true;
    }
}
