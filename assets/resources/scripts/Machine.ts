import {
  _decorator,
  Component,
  Node,
  instantiate,
  JsonAsset,
  Prefab,
  Sprite,
  UITransform,
  log,
  ParticleUtils,
  Vec2,
  Vec3,
  Graphics,
  Enum,
} from "cc";
import { ReelSpin } from "./Machine/Reels/ReelSpin";
import { HUD } from "./HUD/HUD";
import { Payline } from "./Machine/Payline/Payline";
import { REEL_ANIMATION_TYPE, REELTYPE } from "./Common/constant";
const { ccclass, property } = _decorator;

@ccclass("Machine")
export class Machine extends Component {
  @property({ type: Prefab })
  ReelSpin: Prefab = null;
  @property({ type: Prefab })
  ReelDrop: Prefab = null;
  @property({ type: Number })
  NumberOfReels = 25;
  @property(Node) public paylineBg: Node = null;
  @property({ type: Number })
  TileHeight = 100;
  @property({ type: Number })
  TileWidth = 100;
  @property({ type: Enum(REELTYPE) })
  Reeltype: REELTYPE = REELTYPE.REELDROP;

  private reels: Node[] = [];
  newReel: Node;
  Reel: Prefab = null;
  ReelType = null;
  setTOut = 0;
  tileSize = { Height: this.TileHeight, Width: this.TileWidth };
  hudScript = null;
  reelScript = null;

  @property(Node)
  machineBackground = null;

  payLineScript: Payline = null;
  protected onLoad(): void {}

  start() {
    this.payLineScript = this.paylineBg.getComponent(Payline);
    this.createMachine(this.Reeltype);
  }
  get MachineDelegate() {
    return this;
  }
  /**
   * This Function Call After Spin Button Clicked
   * Delegate Use in HUD
   */
  reelAnimation() {
    switch (this.Reeltype) {
      case REELTYPE.REELSPIN:
        this.spin();
        break;
      case REELTYPE.REELDROP:
        this.drop();
    }
  }
  /**
   * @description this function is used to createMachine by adding reels in Machine
   */
  createMachine(ReelType) {
    this.reels = [];
    this.node.getComponent(UITransform).width = this.NumberOfReels * this.tileSize.Width;

    this.machineBackground.getComponent(UITransform).width = this.node.getComponent(UITransform).width;
    // this.paylineBg.getComponent(UITransform).width = this.node.getComponent(UITransform).width
    //Deciding which animation will play
    switch (ReelType) {
      case REELTYPE.REELSPIN:
        this.Reel = this.ReelSpin;
        this.ReelType = REEL_ANIMATION_TYPE.REELSPIN;
        // this.scheduleOnce(this.spin, 1);
        break;
      case REELTYPE.REELDROP:
        this.Reel = this.ReelDrop;
        this.ReelType = REEL_ANIMATION_TYPE.REELDROP;
        this.setTOut = 1;
        // this.scheduleOnce(this.drop, 1);
        break;

      default:
        break;
    }
    for (let index = 0; index < this.NumberOfReels; index++) {
      this.newReel = instantiate(this.Reel);
      this.node.addChild(this.newReel);
      this.reels[index] = this.newReel;
      this.reelScript = this.newReel.getComponent(this.ReelType);
      //   console.log("Script", this.reelScript);
      this.reelScript.SettingMachineDelegate = this;
      this.node.getComponent(UITransform).height = this.reelScript.createReel(index, this.tileSize);
      // reelScript.shuffle();
    }
  }

  hudScriptCatcher(hudScript) {
    this.hudScript = hudScript;
  }

  showPayline() {
    let size = this.node.getComponent(UITransform).contentSize;
    this.payLineScript.initTilePos(this.NumberOfReels, this.reelScript.noOfTiles, size, this.ReelType);

    this.scheduleOnce(() => {
      this.payLineScript.createLine();
      this.payLineScript.setNodePosition(
        new Vec3(
          -1 * (this.node.getComponent(UITransform).width / 2),
          -1 * (this.node.getComponent(UITransform).height / 2),
          0
        )
      );
    }, this.NumberOfReels + 1);
  }

  stop() {
    this.showPayline();

    switch (this.Reeltype) {
      case REELTYPE.REELSPIN:
        //   console.log("STOP", this.Reel.name);
        //  this.hudScript.spinButtonInteraction(true);
        for (let index = 0; index < this.NumberOfReels; index++) {
          const spinDelay = index * 1.2;
          const theReel: any = this.reels[index].getComponent(this.ReelType);
          this.scheduleOnce(() => {
            theReel.readyStop();
          }, spinDelay);
        }
        break;
    }
  }

  drop(): void {
    this.payLineScript.clearPaylines();

    this.scheduleOnce(() => {
      this.stop();
    }, 1);
    // this.spinning = true;
    for (let index = 0; index < this.NumberOfReels; index += 1) {
      this.scheduleOnce(() => {
        const theReel: any = this.reels[index].getComponent(this.ReelType);
        theReel.doSpin(index);
      }, (index + 1) * 0.1 * this.setTOut);
    }
  }

  spin() {
    this.payLineScript.clearPaylines();
    this.scheduleOnce(() => {
      this.stop();
    }, 5);

    for (let index = 0; index < this.NumberOfReels; index += 1) {
      const theReel: any = this.reels[index].getComponent(this.ReelType);
      theReel.doSpin(0.03);
    }
  }

  SpinAgainInteraction(reelnumber) {
    // console.log("check", this.NumberOfReels, reelnumber);
    if (this.NumberOfReels == reelnumber) {
      this.hudScript.spinButtonInteraction(true);
    }
  }
  update(deltaTime: number) {}
}
