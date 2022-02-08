import * as THREE from 'three';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';

/**
 * 植物
 */
export default class Plant implements Component {
    private readonly name: string = 'Plant-植物';
    
    private scene: THREE.Scene = null; // 场景
    
    private readonly track: number = 1000; // 轨道
    private readonly range: number = 0.2; // 范围
    private plant: {
        cycle: number,
        y: number,
        z: number,
        object: THREE.Object3D
    }[] = []; // 植物
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Plant
     * @param {*} scene 场景
     */
    constructor(scene: any) {
        this.scene = scene.instance;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     * @return {void}
     */
    private create(): void {
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, 0, 0);
    }
    
    /**
     * 初始化
     * @return {void}
     */
    private init(): void {
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     * @return {void}
     */
    public update(): void {
        const cycleS = 0.003; // 周期速度
        
        if (Math.random() > 0.8) this.createTree();
        if (Math.random() > 0.9) this.createFlower();
        
        this.plant = this.plant.filter((v, i, a) => {
            v.cycle += cycleS;
            v.object.position.x = Math.cos(v.cycle) * v.y;
            v.object.position.y = Math.sin(v.cycle) * v.y;
            v.object.rotation.z = -Math.PI / 2 + v.cycle;
            if (v.cycle >= Math.PI * (1 - this.range)) {
                this.instance.remove(v.object);
                return false;
            }
            return true;
        });
    }
    
    /**
     * 创建树木
     * @return {void}
     */
    private createTree(): void {
        const height = 12, // 树干高
            scale = Global.Function.Calc.random(2, 5) * 0.3,
            y = this.track + height * scale / 2 - 2,
            z = this.getPlantPosition();
        
        if (z === 0) return;
        
        const trunkG = new THREE.CylinderGeometry(
            10, 10, height,
            6, 6),
            trunkM = new THREE.MeshBasicMaterial({
                color: '#59332e'
            }),
            trunk = new THREE.Mesh(trunkG, trunkM);
        trunk.position.set(0, 0, 0);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        
        const leavesG1 = new THREE.CylinderGeometry(
            1, 36,
            36, 4
            ),
            leavesG2 = new THREE.CylinderGeometry(
                1, 27,
                27, 4
            ),
            leavesG3 = new THREE.CylinderGeometry(
                1, 18,
                18, 4
            ),
            leavesM = new THREE.MeshPhongMaterial({
                color: '#157218',
                flatShading: true
            }),
            leaves1 = new THREE.Mesh(leavesG1, leavesM),
            leaves2 = new THREE.Mesh(leavesG2, leavesM),
            leaves3 = new THREE.Mesh(leavesG3, leavesM);
        leaves1.position.set(0, height / 2 + 36 / 2, 0);
        leaves1.castShadow = true;
        leaves1.receiveShadow = true;
        leaves2.position.set(0, height / 2 + 36 * 0.6 + 27 / 2, 0);
        leaves2.castShadow = true;
        leaves2.receiveShadow = true;
        leaves3.position.set(0, height / 2 + 36 * 0.6 + 27 * 0.7 + 18 / 2, 0);
        leaves3.castShadow = true;
        leaves3.receiveShadow = true;
        
        const tree = new THREE.Group(),
            treeBox = new THREE.Object3D();
        tree.position.set(0, 0, 0);
        tree.rotation.set(0, Math.random() * Math.PI * 2, 0);
        tree.add(trunk);
        tree.add(leaves1);
        tree.add(leaves2);
        tree.add(leaves3);
        treeBox.position.set(0, y, z);
        treeBox.scale.setScalar(scale);
        treeBox.add(tree);
        this.plant.push({
            cycle: Math.PI * this.range,
            y, z,
            object: treeBox
        });
        this.instance.add(treeBox);
    }
    
    /**
     * 创建花朵
     * @return {void}
     */
    private createFlower(): void {
        const color = [
                '#f25346',
                '#edeb27',
                '#f5986e',
                '#68c3c0',
                '#551a8b'
            ],
            petalD = 12,
            height = Global.Function.Calc.random(30, 50) + 2, // 花枝高
            scale = Global.Function.Calc.random(2, 4) * 0.1,
            y = this.track + height * scale / 2 - 2,
            z = this.getPlantPosition();
        
        if (z === 0) return;
        
        const trunkG = new THREE.CylinderGeometry(
            3, 3, height,
            6, 6),
            trunkM = new THREE.MeshBasicMaterial({
                color: '#157218'
            }),
            trunk = new THREE.Mesh(trunkG, trunkM);
        trunk.position.set(0, 0, 0);
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        
        const stamenG = new THREE.BoxGeometry(
            8, 8, 5,
            1, 1, 1
            ),
            stamenM = new THREE.MeshBasicMaterial({
                color: color[Global.Function.Calc.random(0, 4)]
            }),
            stamen = new THREE.Mesh(stamenG, stamenM),
            petalG = new THREE.BoxGeometry(
                15, 20, 5,
                1, 1, 1
            ) as any,
            petalM = new THREE.MeshBasicMaterial({
                color: color[Global.Function.Calc.random(0, 4)]
            }),
            petalBox = new THREE.Group();
        stamen.position.set(0, 0, 2);
        petalG.attributes.position[3 * 4] -= 4;
        petalG.attributes.position[3 * 5] -= 4;
        petalG.attributes.position[3 * 6] += 4;
        petalG.attributes.position[3 * 7] += 4;
        petalBox.position.set(0, height - 15, 3);
        petalBox.rotation.set(0, 0, Math.random() * Math.PI * 2);
        petalBox.add(stamen);
        
        for (let i = 0; i < 4; i++) {
            const petal = new THREE.Mesh(petalG, petalM);
            if (i === 0) petal.position.set(petalD, 0, 0);
            if (i === 1) petal.position.set(0, petalD, 0);
            if (i === 2) petal.position.set(-petalD, 0, 0);
            if (i === 3) petal.position.set(0, -petalD, 0);
            petal.rotation.z = i * Math.PI / 2;
            petal.castShadow = true;
            petal.receiveShadow = true;
            petalBox.add(petal);
        }
        
        const flower = new THREE.Object3D();
        flower.position.set(0, y, z);
        flower.scale.setScalar(scale);
        flower.add(trunk);
        flower.add(petalBox);
        this.plant.push({
            cycle: Math.PI * this.range,
            y, z,
            object: flower
        });
        this.instance.add(flower);
    }
    
    /**
     * 获取植物位置
     * @return {number} z轴位置
     */
    private getPlantPosition(): number {
        const position = Global.Function.Calc.random(-350, 500),
            plant = this.plant.find((v, i, a) => {
                return v.cycle < 0.7 && Math.abs(position - v.z) <= 50
            });
        if (plant) {
            return 0;
        } else {
            return position;
        }
    }
}
