import { _decorator, Component, Graphics, Node, Rect, UITransform, Vec2, Vec3 } from 'cc';
import { Animation_1 } from '../../Animation/Animation_1';
import { ANIMATION_TYPES } from '../../AnimationTypes';
const { ccclass, property } = _decorator;

@ccclass('Payline')
export class Payline extends Component {

    tilePos: number[][] = new Array<Array<number>>();

    @property(Node)
    payLineBG: Node = null!;

    @property(Node)
    popUpAnimation: Node = null;

    popUpScript = null;
    payLineData = [0, 9];

    paylineDimensions = null;
    start() {
        this.popUpScript = this.popUpAnimation.getComponent(Animation_1);

    }


    setNodePosition(pos) {
        this.node.setPosition(pos);
        this.popUpScript.setNodePosition(pos)
    }
    createLine() {


        let graphicComponent = this.node.getComponent(Graphics);
        graphicComponent.lineWidth = 10;
        let startPoint = 0
        let endPoint = (this.paylineDimensions.width)
        let pos = null;
        pos = this.tilePos[this.payLineData[0]];
        graphicComponent.lineTo(startPoint, pos[1]);
        graphicComponent.moveTo(startPoint, pos[1]);
        for (let i = 0; i < this.payLineData.length; i++) {
            pos = this.tilePos[this.payLineData[i]];
            this.popUpScript.playAnimation(pos[0], pos[1]);
            graphicComponent.lineTo(pos[0], pos[1]);
            graphicComponent.moveTo(pos[0], pos[1]);
        }
        graphicComponent.lineTo(endPoint, pos[1]);
        graphicComponent.moveTo(endPoint, pos[1]);
        graphicComponent.stroke();

    }

    clearPaylines() {
        let graphicComponent = this.node.getComponent(Graphics);
        graphicComponent.clear();
        this.popUpScript.stopAnimation();
    }
    initTilePos(reelNo, tileNo, size, reel) {

        let tileNumber = tileNo;
        if (ANIMATION_TYPES.REELSPIN == reel) {
            tileNumber = tileNo - 2;
        }
        this.node.getComponent(UITransform).contentSize = size;
        console.log("container size", size);
        this.paylineDimensions = size;
        let halfTileH = this.paylineDimensions.height / ((tileNumber) * 2);
        let halfTileW = this.paylineDimensions.width / (reelNo * 2);

        for (let j = tileNumber; j > 0; j--) {
            for (let i = 1; i <= reelNo; i++) {

                this.tilePos.push([(this.paylineDimensions.width / reelNo) * i - halfTileW, (this.paylineDimensions.height / (tileNumber)) * j - halfTileH]);
            }
        }

        console.log(this.tilePos, "Tile position array");

    }

    isActive() {
        return this.node.active;
    }

    inactivePayline() {
        this.node.active = false;
    }

    activePayline() {
        this.node.active = true;
    }

    update(deltaTime: number) {

    }
}

