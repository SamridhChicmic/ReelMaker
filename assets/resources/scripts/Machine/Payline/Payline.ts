import { _decorator, Component, Graphics, Node, Rect, UITransform, Vec2, Vec3 } from "cc";
import { Animation_1 } from "../../Animation/Animation_1";
import { ANIMATION_TYPES } from "../../AnimationTypes";
import { gameData } from "../../Common/gameData";
const { ccclass, property } = _decorator;

@ccclass("Payline")
export class Payline extends Component {
  tilePos: number[][] = new Array<Array<number>>();

  @property(Node)
  payLineBG: Node = null!;

  @property(Node)
  popUpAnimation: Node = null;

  popUpScript = null;
  paylineDimensions = null;
  tileRef = [];
  //-------------------Containes data for showing paylines----------------
  payLineData = [7, 3, 11, 14];
  //----------------------------------------------------------------------

  start() {
    this.popUpScript = this.popUpAnimation.getComponent(Animation_1);
  }

  setNodePosition(pos) {
    this.node.setPosition(pos);
    this.popUpScript.setNodePosition(pos);
  }

  createLine() {
    // this.tileRef = gameData.getInstance().getTileRefArr();
    // console.log("Tile Ref--->", this.tileRef);
    console.log("CreateLine", this.tilePos);
    let graphicComponent = this.node.getComponent(Graphics);
    graphicComponent.lineWidth = 10;
    let startPoint = 0;
    let endPoint = this.paylineDimensions.width;
    let pos = null;
    pos = this.tilePos[this.payLineData[0]];
    // graphicComponent.lineTo(startPoint, pos[1]);
    graphicComponent.moveTo(startPoint, pos[1]);
    for (let i = 0; i < this.payLineData.length; i++) {
      pos = this.tilePos[this.payLineData[i]];
      // this.popUpScript.playAnimation(pos[0], pos[1], this.payLineData[i]);
      graphicComponent.lineTo(pos[0], pos[1]);
      graphicComponent.moveTo(pos[0], pos[1]);
    }
    graphicComponent.lineTo(endPoint, pos[1]);
    // graphicComponent.moveTo(endPoint, pos[1]);
    graphicComponent.stroke();
  }

  clearPaylines() {
    let graphicComponent = this.node.getComponent(Graphics);
    graphicComponent.clear();
    // this.popUpScript.stopAnimation();
  }

  initTilePos(reelNo, tileNo, size, reel) {
    let tileNumber = tileNo;
    if (ANIMATION_TYPES.REELSPIN == reel) {
      // Masked Tile
      tileNumber = tileNo - 2;
    }
    this.node.getComponent(UITransform).contentSize = size;
    this.paylineDimensions = size;
    // half Width and Height of Each tile
    let halfTileH = this.paylineDimensions.height / (tileNumber * 2);
    let halfTileW = this.paylineDimensions.width / (reelNo * 2);

    for (let j = 1; j <= reelNo; j++) {
      for (let i = tileNumber; i > 0; i--) {
        this.tilePos.push([
          (this.paylineDimensions.width / reelNo) * j - halfTileW,
          (this.paylineDimensions.height / tileNumber) * i - halfTileH,
        ]);
      }
    }
  }

  update(deltaTime: number) {}
}
