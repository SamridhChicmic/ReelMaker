import { _decorator, Component, Node, SpriteFrame, Sprite } from "cc";
import { ResourceManager } from "./ResourceManager";
const { ccclass, property } = _decorator;

@ccclass("ResourceLoading")
export class ResourceLoading extends Component {
  @property(Node)
  allUpdateAbleAssets: Node[] = [];
  start() {}
  spritesChanging() {
    this.allUpdateAbleAssets.forEach((UpdateAbleAsset) => {
      let newFrame: SpriteFrame = ResourceManager.getInstance().fetchingSameNameSprite(
        UpdateAbleAsset.name + ".png"
      );
      if (newFrame) {
        UpdateAbleAsset.getComponent(Sprite).spriteFrame = newFrame;
      } else {
        console.log(`${UpdateAbleAsset.name}.png Frame Not Found For ${this.node.name} Component`);
      }
    });
  }

  update(deltaTime: number) {}
}
