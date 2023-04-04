import { _decorator, Component, Node, instantiate, JsonAsset, Prefab, Sprite } from "cc";
import { ReelSpin } from "./Machine/Reels/ReelSpin";
import { ANIMATION_TYPES } from "./AnimationTypes";
const { ccclass, property } = _decorator;

@ccclass("Machine")
export class Machine extends Component {

  @property({ type: Prefab })
  ReelSpin: Prefab = null;

  @property({ type: Prefab })
  ReelDrop: Prefab = null;

  private reels: Node[] = [];
  newReel: Node;
  public numberOfReels = 5;
  Reel: Prefab = null;
  reelScriptName = null;
  setTOut = 0;
  start() {
    this.createMachine("ReelDrop");

    this.scheduleOnce(this.stop, 4);
  }

  /**
   * @description this function is used to createMachine by adding reels in Machine
   */
  createMachine(AnimationType) {
    this.reels = [];

    //Deciding which animation will play
    switch (AnimationType) {
      case ANIMATION_TYPES.REELSPIN:
        this.Reel = this.ReelSpin;
        this.reelScriptName = ANIMATION_TYPES.REELSPIN;
        this.scheduleOnce(this.spin, 1);
        break;

      case ANIMATION_TYPES.REELDROP:
        this.Reel = this.ReelDrop;
        this.reelScriptName = ANIMATION_TYPES.REELDROP;
        this.setTOut = 1;
        this.scheduleOnce(this.drop, 1);
        break;

      default:
        break;
    }
    for (let i = 0; i < this.numberOfReels; i++) {
      this.newReel = instantiate(this.Reel);
      this.node.addChild(this.newReel);
      this.reels[i] = this.newReel;
      const reelScript: any = this.newReel.getComponent(this.reelScriptName);
      reelScript.createReel(i);
      // reelScript.shuffle();
    }
  }



  stop() {

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = i * 1.2;
      const theReel: any = this.reels[i].getComponent(this.reelScriptName);
      this.scheduleOnce(() => {
        theReel.readyStop();
      }, spinDelay);
    }
  }


  drop(): void {

    // this.spinning = true;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      this.scheduleOnce(() => {
        const theReel: any = this.reels[i].getComponent(this.reelScriptName);
        theReel.doSpin(i);
      }, ((i + 1) * 0.1) * this.setTOut);

    }

  }

  spin() {
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel: any = this.reels[i].getComponent(this.reelScriptName);
      theReel.doSpin(0.03);
    }
  }


  update(deltaTime: number) { }
}
