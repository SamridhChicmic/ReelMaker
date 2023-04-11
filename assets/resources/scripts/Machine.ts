import { _decorator, Component, Node, instantiate, JsonAsset, Prefab, Sprite, UITransform, log, ParticleUtils, Vec2, Vec3, Graphics } from "cc";
import { ReelSpin } from "./Machine/Reels/ReelSpin";
import { ANIMATION_TYPES } from "./AnimationTypes";
import { HUD } from "./HUD/HUD";
import { Payline } from "./Machine/Payline/Payline";
const { ccclass, property } = _decorator;

@ccclass("Machine")
export class Machine extends Component {

  @property({ type: Prefab })
  ReelSpin: Prefab = null;

  @property({ type: Prefab })
  ReelDrop: Prefab = null;

  private reels: Node[] = [];
  newReel: Node;

  @property(Node) public paylineBg: Node = null;

  public numberOfReels = 7;
  Reel: Prefab = null;
  reelScriptName = null;
  setTOut = 0;
  tileSize = { Height: 200, Width: 200 }
  hudScript = null;
  reelScript = null;

  @property(Node)
  machineBackground = null;

  payLineScript = null;
  protected onLoad(): void {

  }

  start() {
    this.payLineScript = this.paylineBg.getComponent(Payline);
    this.createMachine("ReelSpin", this.tileSize);




  }

  /**
   * @description this function is used to createMachine by adding reels in Machine
   */
  createMachine(AnimationType, tileSize) {
    this.reels = [];
    this.node.getComponent(UITransform).width = this.numberOfReels * this.tileSize.Width;

    this.machineBackground.getComponent(UITransform).width = this.node.getComponent(UITransform).width;
    // this.paylineBg.getComponent(UITransform).width = this.node.getComponent(UITransform).width
    //Deciding which animation will play
    switch (AnimationType) {
      case ANIMATION_TYPES.REELSPIN:
        this.Reel = this.ReelSpin;
        this.reelScriptName = ANIMATION_TYPES.REELSPIN;
        // this.scheduleOnce(this.spin, 1);
        break;

      case ANIMATION_TYPES.REELDROP:
        this.Reel = this.ReelDrop;
        this.reelScriptName = ANIMATION_TYPES.REELDROP;
        this.setTOut = 1;
        // this.scheduleOnce(this.drop, 1);

        break;

      default:
        break;
    }
    for (let i = 0; i < this.numberOfReels; i++) {
      this.newReel = instantiate(this.Reel);
      this.node.addChild(this.newReel);
      this.reels[i] = this.newReel;
      this.reelScript = this.newReel.getComponent(this.reelScriptName);
      this.node.getComponent(UITransform).height = this.reelScript.createReel(i, this.tileSize);
      // reelScript.shuffle();
    }
  }

  hudScriptCatcher(hudScript) {
    this.hudScript = hudScript;
  }


  showPayline() {
    let size = this.node.getComponent(UITransform).contentSize;
    this.payLineScript.initTilePos(this.numberOfReels, this.reelScript.noOfTiles, size);

    this.scheduleOnce(() => {
      this.payLineScript.createLine();
      this.payLineScript.setNodePosition(new Vec3(-1 * (this.node.getComponent(UITransform).width / 2), -1 * ((this.node.getComponent(UITransform).height / 2) + 45), 0))
    }, this.numberOfReels + 1)

  }

  stop() {
    this.showPayline();


    if (this.ReelSpin.name == ANIMATION_TYPES.REELSPIN) {
      this.hudScript.spinButtonInteraction(true);
      for (let i = 0; i < this.numberOfReels; i += 1) {
        const spinDelay = i * 1.2;
        const theReel: any = this.reels[i].getComponent(this.reelScriptName);
        this.scheduleOnce(() => {
          theReel.readyStop();
        }, spinDelay);
      }
    }
  }


  drop(): void {
    this.payLineScript.clearPaylines();

    this.scheduleOnce(() => {
      this.stop();

    }, 1)
    // this.spinning = true;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      this.scheduleOnce(() => {
        const theReel: any = this.reels[i].getComponent(this.reelScriptName);
        theReel.doSpin(i);
      }, ((i + 1) * 0.1) * this.setTOut);

    }

  }


  spin() {
    this.payLineScript.clearPaylines();
    this.scheduleOnce(() => {
      this.stop();
    }, 5)

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel: any = this.reels[i].getComponent(this.reelScriptName);
      theReel.doSpin(0.03);
    }
  }


  update(deltaTime: number) { }
}
