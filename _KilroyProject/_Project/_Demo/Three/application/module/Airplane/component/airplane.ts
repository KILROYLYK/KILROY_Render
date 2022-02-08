import * as THREE from 'three';

import Component from '../../../interface/component';
import Global from '../../../constant/_global';

/**
 * 飞机
 */
export default class Airplane implements Component {
    private readonly name: string = 'Airplane-飞机';
    
    private scene: THREE.Scene = null; // 场景
    
    private airplane: THREE.Object3D = null; // 飞机
    private body: THREE.Group = null; // 机身
    private head: THREE.Group = null; // 机头
    private tail: THREE.Group = null; // 机尾
    private wing: THREE.Group = null; // 机翼
    private propeller: THREE.Object3D = null; // 螺旋桨
    private readonly moveP: any = { // 移动位置
        x: 0,
        y: 0,
        z: 0
    };
    
    public instance: THREE.Group = null; // 实例
    
    /**
     * 构造函数
     * @constructor Airplane
     * @param {*} scene 场景
     */
    constructor(scene: any) {
        this.scene = scene.instance;
        
        this.create();
        this.init();
    }
    
    /**
     * 创建
     */
    private create(): void {
        const track = 1000; // 轨道
        
        this.airplane = new THREE.Object3D();
        this.airplane.position.set(0, 0, 0);
        this.airplane.scale.setScalar(0.6);
        
        this.instance = new THREE.Group();
        this.instance.name = this.name;
        this.instance.position.set(0, track + 130, 200);
        
        this.createBody();
        this.createHead();
        this.createTail();
        this.createWing();
        this.createPropeller();
    }
    
    /**
     * 初始化
     */
    private init(): void {
        this.airplane.add(this.body);
        this.airplane.add(this.head);
        this.airplane.add(this.wing);
        this.airplane.add(this.tail);
        this.airplane.add(this.propeller);
        this.instance.add(this.airplane);
        this.scene.add(this.instance);
    }
    
    /**
     * 更新
     */
    public update(): void {
        const ease = 12,
            moveS = 0.5,
            centerP = Global.FN.getDomCenter(); // 中心位置
        
        if (!this.instance) return;
        
        this.propeller.rotateX(0.3);
        
        this.moveP.x = (Global.Focus.x - centerP.x) * moveS;
        this.moveP.y = -(Global.Focus.y - centerP.y) * moveS;
        
        if (this.moveP.x > 250) this.moveP.x = 250;
        if (this.moveP.x < -250) this.moveP.x = -250;
        if (this.moveP.y > 120) this.moveP.y = 120;
        if (this.moveP.y < -100) this.moveP.y = -100;
        
        Global.FN.setEase(this.airplane.position, this.moveP, ease);
        Global.FN.setEase(this.airplane.rotation, {
            x: -this.moveP.y * 0.005,
            y: 0,
            z: -this.moveP.x * 0.002
        }, ease);
    }
    
    /**
     * 创建机身
     */
    private createBody(): void {
        const bodyG = new THREE.BoxGeometry(
            80, 50, 50,
            1, 1, 1
            ) as any,
            bodyM = new THREE.MeshPhongMaterial({
                color: '#f25346',
                flatShading: true
            }),
            body = new THREE.Mesh(bodyG, bodyM);
        bodyG.attributes.position[3 * 4] -= 10;
        bodyG.attributes.position[3 * 4 + 1] += 20;
        bodyG.attributes.position[3 * 5] -= 10;
        bodyG.attributes.position[3 * 5 + 1] -= 20;
        bodyG.attributes.position[3 * 6] += 30;
        bodyG.attributes.position[3 * 6 + 1] += 20;
        bodyG.attributes.position[3 * 7] += 30;
        bodyG.attributes.position[3 * 7 + 1] -= 20;
        body.position.set(0, 0, 0);
        body.castShadow = true;
        body.receiveShadow = true;
        
        const seatG = new THREE.BoxGeometry(
            20, 5, 20,
            1, 1, 1
            ),
            seatM = new THREE.MeshPhongMaterial({
                color: '#911610',
                flatShading: true
            }),
            seat = new THREE.Mesh(seatG, seatM);
        seat.position.set(20, 23, 0);
        seat.castShadow = true;
        seat.receiveShadow = true;
        
        const windshieldG = new THREE.BoxGeometry(
            3, 10, 30,
            1, 1, 1
            ),
            windshieldM = new THREE.MeshPhongMaterial({
                color: '#d8d0d1',
                flatShading: true,
                opacity: .3,
                transparent: true
            }),
            windshield = new THREE.Mesh(windshieldG, windshieldM);
        windshield.position.set(30, 30, 0);
        
        const bracketG = new THREE.BoxGeometry(
            34, 15, 10,
            1, 1, 1
            ),
            bracketM = new THREE.MeshPhongMaterial({
                color: '#911610',
                flatShading: true
            }),
            leftBracket = new THREE.Mesh(bracketG, bracketM),
            rightBracket = new THREE.Mesh(bracketG, bracketM);
        leftBracket.position.set(23, -12, -25);
        leftBracket.castShadow = true;
        leftBracket.receiveShadow = true;
        rightBracket.position.set(23, -12, 25);
        rightBracket.castShadow = true;
        rightBracket.receiveShadow = true;
        
        const wheelG = new THREE.CylinderGeometry(
            5, 5, 5,
            8, 8),
            wheelM = new THREE.MeshBasicMaterial({
                color: '#070707'
            }),
            leftWheel = new THREE.Mesh(wheelG, wheelM),
            rightWheel = new THREE.Mesh(wheelG, wheelM);
        leftWheel.position.set(18, -20, -25);
        leftWheel.rotation.set(Math.PI / 2, 0, 0);
        leftWheel.castShadow = true;
        leftWheel.receiveShadow = true;
        rightWheel.position.set(18, -20, 25);
        rightWheel.rotation.set(Math.PI / 2, 0, 0);
        rightWheel.castShadow = true;
        rightWheel.receiveShadow = true;
        
        this.body = new THREE.Group();
        this.body.position.set(0, 0, 0);
        this.body.add(body);
        this.body.add(seat);
        this.body.add(windshield);
        this.body.add(leftBracket);
        this.body.add(rightBracket);
        this.body.add(leftWheel);
        this.body.add(rightWheel);
    }
    
    /**
     * 创建机头
     */
    private createHead(): void {
        const headG = new THREE.BoxGeometry(
            20, 50, 50,
            1, 1, 1
            ),
            headM = new THREE.MeshPhongMaterial({
                color: '#d8d0d1',
                flatShading: true
            }),
            head = new THREE.Mesh(headG, headM);
        head.position.set(40, 0, 0);
        head.castShadow = true;
        head.receiveShadow = true;
        
        const drillG = new THREE.BoxGeometry(
            20, 10, 10,
            1, 1, 1
            ) as any,
            drillM = new THREE.MeshPhongMaterial({
                color: '#59332e',
                flatShading: true
            }),
            drill = new THREE.Mesh(drillG, drillM);
        drillG.attributes.position[3 * 4] -= 5;
        drillG.attributes.position[3 * 4 + 1] += 5;
        drillG.attributes.position[3 * 5] -= 5;
        drillG.attributes.position[3 * 5 + 1] -= 5;
        drillG.attributes.position[3 * 6] += 5;
        drillG.attributes.position[3 * 6 + 1] += 5;
        drillG.attributes.position[3 * 7] += 5;
        drillG.attributes.position[3 * 7 + 1] -= 5;
        drill.position.set(47, 0, 0);
        drill.castShadow = true;
        drill.receiveShadow = true;
        
        this.head = new THREE.Group();
        this.head.position.set(0, 0, 0);
        this.head.add(head);
        this.head.add(drill);
    }
    
    /**
     * 创建机尾
     */
    private createTail(): void {
        const topTG = new THREE.BoxGeometry(
            15, 25, 5,
            1, 1, 1
            ),
            topTM = new THREE.MeshPhongMaterial({
                color: '#911610',
                flatShading: true
            }),
            topTail = new THREE.Mesh(topTG, topTM);
        topTail.position.set(-35, 20, 0);
        topTail.castShadow = true;
        topTail.receiveShadow = true;
        
        const bottomTG = new THREE.BoxGeometry(
            15, 5, 5,
            1, 1, 1
            ),
            bottomTM = new THREE.MeshPhongMaterial({
                color: '#911610',
                flatShading: true
            }),
            bottomTail = new THREE.Mesh(bottomTG, bottomTM);
        bottomTail.position.set(-35, 2, 0);
        bottomTail.castShadow = true;
        bottomTail.receiveShadow = true;
        
        const bracketG = new THREE.BoxGeometry(
            10, 5, 22,
            1, 1, 1
            ),
            bracketTM = new THREE.MeshPhongMaterial({
                color: '#911610',
                flatShading: true
            }),
            bracket = new THREE.Mesh(bracketG, bracketTM);
        bracket.position.set(-18, -2, 0);
        bracket.castShadow = true;
        bracket.receiveShadow = true;
        
        const wheelG = new THREE.CylinderGeometry(
            5, 5, 5,
            8, 8),
            wheelM = new THREE.MeshBasicMaterial({
                color: '#070707'
            }),
            wheel = new THREE.Mesh(wheelG, wheelM);
        wheel.position.set(-22, -5, 0);
        wheel.rotation.set(Math.PI / 2, 0, 0);
        wheel.castShadow = true;
        wheel.receiveShadow = true;
        
        this.tail = new THREE.Group();
        this.tail.position.set(0, 0, 0);
        this.tail.add(topTail);
        this.tail.add(bottomTail);
        this.tail.add(bracket);
        this.tail.add(wheel);
    }
    
    /**
     * 创建机翼
     * @return {void}
     */
    private createWing(): void {
        const wingG = new THREE.BoxGeometry(
            40, 4, 120,
            1, 1, 1
            ),
            wingM = new THREE.MeshPhongMaterial({
                color: '#911610',
                flatShading: true
            }),
            topWing = new THREE.Mesh(wingG, wingM),
            bottomWing = new THREE.Mesh(wingG, wingM);
        topWing.position.set(20, 10, 0);
        topWing.castShadow = true;
        topWing.receiveShadow = true;
        bottomWing.position.set(20, -5, 0);
        bottomWing.castShadow = true;
        bottomWing.receiveShadow = true;
        
        const bracketG = new THREE.CylinderGeometry(
            2, 2, 15,
            6, 6
            ),
            bracketM = new THREE.MeshPhongMaterial({
                color: '#911610',
                flatShading: true
            }),
            leftBracket = new THREE.Mesh(bracketG, bracketM),
            rightBracket = new THREE.Mesh(bracketG, bracketM);
        leftBracket.position.set(20, 2, -55);
        leftBracket.castShadow = true;
        leftBracket.receiveShadow = true;
        rightBracket.position.set(20, 2, 55);
        rightBracket.castShadow = true;
        rightBracket.receiveShadow = true;
        
        this.wing = new THREE.Group();
        this.wing.position.set(0, 0, 0);
        this.wing.add(topWing);
        this.wing.add(bottomWing);
        this.wing.add(leftBracket);
        this.wing.add(rightBracket);
    }
    
    /**
     * 创建螺旋桨
     * @return {void}
     */
    private createPropeller(): void {
        const bladeG = new THREE.BoxGeometry(
            1, 60, 10,
            1, 1, 1
            ),
            bladeM = new THREE.MeshPhongMaterial({
                color: '#23190f',
                flatShading: true
            }),
            blade1 = new THREE.Mesh(bladeG, bladeM),
            blade2 = new THREE.Mesh(bladeG, bladeM);
        blade1.castShadow = true;
        blade1.receiveShadow = true;
        blade2.rotation.set(Math.PI / 2, 0, 0);
        blade2.castShadow = true;
        blade2.receiveShadow = true;
        
        this.propeller = new THREE.Object3D();
        this.propeller.position.set(55, 0, 0);
        this.propeller.add(blade1);
        this.propeller.add(blade2);
    }
}
