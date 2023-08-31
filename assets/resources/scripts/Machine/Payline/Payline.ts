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
  payLineData = [8];
  //----------------------------------------------------------------------

  start() {
    this.popUpScript = this.popUpAnimation.getComponent(Animation_1);
  }

  setNodePosition(pos) {
    this.node.setPosition(pos);
    this.popUpScript.setNodePosition(pos);
  }
  /**
   * Create a payline using payLineData array which contain tile index
   * line start from startpoint to paylinedata tile index's to endpoint
   */
  createLine() {
    //Dont Know why its Used here
    // this.tileRef = gameData.getInstance().getTileRefArr();
    // console.log("Tile Ref--->", this.tileRef);
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
      this.popUpScript.playAnimation(pos[0], pos[1], this.payLineData[i]);
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
    this.popUpScript.stopAnimation();
  }

  initTilePos(reelnumber, tilenumber, contentsize, reelanimation) {
    let tileNumber = tilenumber;
    if (ANIMATION_TYPES.REELSPIN == reelanimation) {
      // Masked Tile
      tileNumber = tilenumber - 2;
    }
    this.node.getComponent(UITransform).contentSize = contentsize;
    this.paylineDimensions = contentsize;
    // half Width and Height of Each tile
    let HalfTileHeight = this.paylineDimensions.height / (tileNumber * 2);
    let HalfTileWidth = this.paylineDimensions.width / (reelnumber * 2);
    // here we are pushing tile index position which is visible in reel
    for (let reelcount = 1; reelcount <= reelnumber; reelcount++) {
      for (let tilecount = tileNumber; tilecount > 0; tilecount--) {
        this.tilePos.push([
          (this.paylineDimensions.width / reelnumber) * reelcount - HalfTileWidth,
          (this.paylineDimensions.height / tileNumber) * tilecount - HalfTileHeight,
        ]);
      }
    }
  }

  update(deltaTime: number) {}
}
