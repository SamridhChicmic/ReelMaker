import { _decorator, Component, Graphics, Node, Rect, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Payline')
export class Payline extends Component {

    tilePos: number[][] = new Array<Array<number>>();

    @property(Node)
    payLineBG: Node = null!;

    payLineData = [0, 6];

    paylineDimensions = null;
    start() {


    }


    setNodePosition(pos) {
        this.node.setPosition(pos);
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
            graphicComponent.lineTo(pos[0], pos[1]);
            graphicComponent.moveTo(pos[0], pos[1]);
        }
        graphicComponent.lineTo(endPoint, pos[1]);
        graphicComponent.moveTo(endPoint, pos[1]);
        graphicComponent.stroke();
    }

    initTilePos(reelNo, tileNo, size) {
        this.node.getComponent(UITransform).contentSize = size;
        console.log("container size", size);
        this.paylineDimensions = size;
        let halfTileH = this.paylineDimensions.height / (tileNo * 2);
        let halfTileW = this.paylineDimensions.width / (reelNo * 2);

        for (let j = tileNo - 2; j > 0; j--) {
            for (let i = 1; i <= reelNo; i++) {
                this.tilePos.push([(this.paylineDimensions.width / reelNo) * i - halfTileW, (this.paylineDimensions.height / (tileNo - 2)) * j - halfTileH]);
            }
        }

        console.log(this.tilePos, "Tile position array");

    }

    update(deltaTime: number) {

    }
}

