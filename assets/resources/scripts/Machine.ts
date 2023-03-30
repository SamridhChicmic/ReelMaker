import { _decorator, Component, Node, instantiate, JsonAsset, Prefab, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Machine")
export class Machine extends Component {

  @property({ type: Prefab })
  Reel: Prefab = null;

  start() {
    for (let i = 1; i <= 4; i++) {
      this.node.addChild(instantiate(this.Reel));
    }
  }

  update(deltaTime: number) { }
}
