import {
  _decorator,
  Component,
  Node,
  Label,
  director,
  Asset,
  Sprite,
  SpriteFrame,
  ProgressBar,
  JsonAsset,
} from "cc";
import { ResourceManager } from "./ResourceManager";
const { ccclass, property } = _decorator;

@ccclass("Loading")
export class Loading extends Component {
  @property({ type: ProgressBar })
  progressBar: ProgressBar = null;
  @property({ type: Label })
  PercentageNumber: Label = null;
  @property({ type: Node })
  LoadingType = null;
  //Variable
  // private totalAssetsLoaded: number = 1;
  progress: number = 0;
  Load: Boolean = false;
  ResourceObject: ResourceManager = null;
  @property({ type: JsonAsset })
  jsonData = null;

  onLoad() {
    this.ResourceObject = ResourceManager.getInstance();
  }

  start() {
    this.loadGameUIAssets();
  }

  loadGameUIAssets() {
    ResourceManager.getInstance().LoadGameUI_SFrames(this.jsonData);
 
  }
  // updateProgress = (loadPercent: number) => {
  //   if (loadPercent == 1) {
  //     this.progressBar.progress = loadPercent;
  //     this.PercentageNumber.string = Math.floor(loadPercent * 100) + "%";
  //     let assetLoader = this.PercentageNumber.node.getParent();
  //     assetLoader.active = false;
  //   } else if (loadPercent < 1) {
  //     this.progressBar.progress = loadPercent;
  //     this.PercentageNumber.string = Math.floor(loadPercent * 100) + "%";
  //   }
  // };

  
  update(deltaTime: number) {}
}
