import {
  _decorator,
  Component,
  Node,
  ProgressBar,
  resources,
  SpriteFrame,
  Label,
  assetManager,
  ImageAsset,
  Texture2D,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("ResourceManager")
export class ResourceManager extends Component {
  private static instance: ResourceManager = null;
  private SpriteFrameArray: any[] = [];
  private percenatge: number = 0;
  private progresBar: Node = null;
  private percentageNumber: Label = null;
  private totalAssets: number = 0;
//   gameUI: any[] = [];
  private ResourceManager() {}
  static getInstance(): ResourceManager {
    if (!ResourceManager.instance) {
      ResourceManager.instance = new ResourceManager();
    }
    return ResourceManager.instance;
  }
  get PercentageNumber(): Label {
    return this.percentageNumber;
  }
  set PercentageNumber(percenatgelabel: Label) {
    this.percentageNumber = percenatgelabel;
  }
  get Progressbar(): Node {
    return this.progresBar;
  }
  set Progressbar(bar: Node) {
    this.progresBar = bar;
  }

  start() {}


  LoadGameUI_SFrames(jsonList) {
    var jsonSprite = jsonList.json;
    let jsonSpriteList = jsonSprite.resourceList;

    // this.totalAssets = this.totalAssets + jsonSpriteList.length;
    if (!jsonSpriteList.length || jsonSpriteList.length == this.SpriteFrameArray.length) return;
    for (let i = 0; i < jsonSpriteList.length; i++) {
      this.loadGameUI_SFrames(jsonSpriteList[i]);

    }
  }
 

  loadGameUI_SFrames(imageName) {
    assetManager.loadRemote<ImageAsset>(imageName, (err, imageAsset) => {
      if (err) {
        console.log("Errorr!!", [err, imageName]);
    
      } else {
        let spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture;

        this.SpriteFrameArray.push({
          sFrame: spriteFrame,
          id: "",
          symbolDescription: imageName,
          animationFrames: [],
        });
      }
    });
  }
  fetchingSameNameSprite(name: string) {
    let sym: SpriteFrame;
        for (let i = 0; i < this.SpriteFrameArray.length; i++) {
            if (name.localeCompare(this.SpriteFrameArray[i].symbolDescription) == 0) {
                sym = this.SpriteFrameArray[i].sFrame;
                break;
            }
        }
        return sym;
  }
  update(deltaTime: number) {}
}
