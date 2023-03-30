import { _decorator, Component, Node, instantiate, JsonAsset, Prefab, Sprite } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Machine")
export class Machine extends Component {
  @property({ type: Prefab })
  Tile: Prefab = null;
  @property({ type: Prefab })
  Machine: Prefab = null;
  @property({ type: Prefab })
  Reel: Prefab = null;
  @property({ type: JsonAsset })
  colorJson: JsonAsset = null;
  start() {
    let json: any = this.colorJson.json;
    let color = json.Color;
    for (var i = 0; i < 5; i++) {
      var reel = instantiate(this.Reel);
      for (var j = 0; j < 3; j++) {
        var tile = instantiate(this.Tile);
        tile.getComponent(Sprite).spriteFrame = color;
      }
    }
  }

  update(deltaTime: number) {}
}
