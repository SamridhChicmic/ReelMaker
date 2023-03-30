import { _decorator, Component, Node, Prefab, JsonAsset, instantiate, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MainScript")
export class MainScript extends Component {

  @property({ type: Prefab })
  Slot: Prefab = null;

  protected onLoad(): void {
    let Slot = instantiate(this.Slot)
    this.node.addChild(Slot)
  }

  update(deltaTime: number) { }
}
