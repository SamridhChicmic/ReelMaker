import { _decorator, Component, Node, instantiate, JsonAsset, Prefab, Sprite } from "cc";
import { reels } from "./reels";
const { ccclass, property } = _decorator;

@ccclass("Machine")
export class Machine extends Component {

  @property({ type: Prefab })
  Reel: Prefab = null;

  private reels: Node[] = [];
  newReel: Node;
  public numberOfReels = 5;

  start() {
    this.createMachine();
    this.scheduleOnce(this.spin, 1);
    this.scheduleOnce(this.stop, 3);
  }

  /**
   * @description this function is used to createMachine by adding reels in Machine
   */
  createMachine() {
    this.reels = [];
    for (let i = 0; i < this.numberOfReels; i++) {
      this.newReel = instantiate(this.Reel);
      this.node.addChild(this.newReel);
      this.reels[i] = this.newReel;
      const reelScript: any = this.newReel.getComponent(reels);
      reelScript.createReel(i);
      // reelScript.shuffle();
    }
  }



  stop() {

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = i * 1.2;
      const theReel = this.reels[i].getComponent(reels);
      this.scheduleOnce(() => {
        theReel.readyStop();
      }, spinDelay);
    }
  }


  spin(): void {

    // this.spinning = true;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i].getComponent(reels);
      theReel.doSpin(0.03);
    }
  }

  update(deltaTime: number) { }
}
