import {
  _decorator,
  Animation,
  animation,
  AnimationClip,
  Component,
  instantiate,
  Label,
  log,
  Node,
  NodePool,
  Prefab,
  resources,
  Sprite,
  SpriteFrame,
  UITransform,
  Vec3,
} from "cc";
import { gameData } from "../Common/gameData";
import { ANIMATION_TYPE } from "../Common/constant";
const { ccclass, property } = _decorator;

@ccclass("Animation_1")
export class Animation_1 extends Component {
  drumsArray = [];

  @property(Prefab)
  popUpPrefab: Prefab = null;
  popUpNode = null;
  poolSize = 15;
  popupPool = new NodePool();
  AnimChildArray: Node[] = [];
  tileRef = null;
  tileparent = null;
  protected onLoad(): void {
    resources.loadDir("sprites/Drumscompressed", SpriteFrame, (err, dir) => {
      if (!err) {
        this.drumsArray = dir;

        console.log(this.drumsArray);
      }
    });
  }

  start() {
    for (let index = 0; index < this.poolSize; index++) {
      let PopupNode = instantiate(this.popUpPrefab);
      this.popupPool.put(PopupNode);
    }
  }

  setNodePosition(pos) {
    this.node.setPosition(pos);
  }

  animationType = ANIMATION_TYPE.ROW;

  playAnimation(x, y, nodeIndex) {
    this.tileRef = gameData.getInstance().getTileRefArr();
    console.log("Reference-->", this.tileRef, nodeIndex, " Ref Tile Length", this.tileRef.length);
    //  this.AnimChildArray = [];
    if (this.animationType == ANIMATION_TYPE.ROW) {
      for (let reel = 0; reel < this.tileRef.length; reel++) {
        let rowIndex = nodeIndex % this.tileRef[0].length;
        this.hideRow(this.tileRef[reel], rowIndex);
      }
    } else if (this.animationType == ANIMATION_TYPE.COLOMN) {
      let reelNumber = Math.floor(nodeIndex / this.tileRef[0].length);
      // As tile Ref conatain Position of tile and Tile Node
      let reelTiles = this.tileRef[reelNumber][0];
      this.tileparent = reelTiles[1].parent;
      console.log("Reelno", reelNumber, "parent", this.tileparent);
      this.tileparent.children.forEach((nodes) => {
        nodes.setScale(new Vec3(0, 0, 0));
        this.AnimChildArray.push(nodes);
      });
    }
    console.log("this.popupPool.size", this.popupPool.size());
    if (this.popupPool.size()) {
      let node = this.popupPool.get();
      node.setPosition(x, y);
      this.node.addChild(node);
      let clip = AnimationClip.createWithSpriteFrames(this.drumsArray, this.drumsArray.length);
      let animation = node.getComponent(Animation);
      let anim = animation.createState(clip, "Drum");
      anim.speed = 1;
      anim.repeatCount = 100;
      anim.play();
    }
  }
  hideRow(visiblereel, reelindex) {
    console.log("Visibile reel", visiblereel, "reelindex", reelindex, "node", visiblereel[reelindex][1]);
    visiblereel[reelindex][1].setScale(new Vec3(0, 0, 0));
    this.AnimChildArray.push(visiblereel[reelindex][1]);
  }
  restoreNodes() {
    this.AnimChildArray.forEach((rownode) => {
      rownode.setScale(new Vec3(1, 1, 1));
    });
    this.AnimChildArray = [];
  }
  stopAnimation() {
    this.restoreNodes();
    while (this.node.children.length > 0) {
      let node = this.node.children.pop();
      setTimeout(() => {
        this.popupPool.put(instantiate(this.popUpPrefab));
        node.destroy();
      });
    }
  }

  update(deltaTime: number) {}
}
