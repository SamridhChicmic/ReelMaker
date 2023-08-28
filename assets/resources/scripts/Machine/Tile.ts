import { _decorator, AnimationClip, Component, Label, Node, Sprite, SpriteFrame, tween, Vec2, Vec3 } from "cc";
import { gameData } from "../Common/gameData";

const { ccclass, property } = _decorator;

@ccclass("Tile")
export class Tile extends Component {
  @property({ type: Node })
  Number: Node = null;
  start() {}
  updateString(data: string) {
    this.Number.getComponent(Label).string = data;
  }
  setTile(Num: SpriteFrame) {
    this.node.getComponent(Sprite).spriteFrame = Num;
    // this.node.getChildByName("tileNum").getComponent(Label).string = Num.toString();
  }

  update(deltaTime: number) {}
}
