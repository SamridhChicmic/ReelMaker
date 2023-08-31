import {
  _decorator,
  animation,
  Component,
  director,
  instantiate,
  Label,
  Layers,
  Layout,
  log,
  Node,
  NodePool,
  Prefab,
  randomRangeInt,
  SpriteFrame,
  tween,
  UI,
  UITransform,
  Vec3,
} from "cc";
import { Tile } from "../Tile";
import { gameData } from "../../Common/gameData";
import { Machine } from "../../Machine";

const { ccclass, property } = _decorator;

@ccclass("ReelSpin")
export class ReelSpin extends Component {
  @property({ type: Prefab })
  tilePrefab: Prefab = null;

  @property({ type: Node })
  public reelAnchor = null;

  @property({ type: SpriteFrame })
  tileSprites: SpriteFrame[] = [];

  public spinSpeed = 0.06;
  public stopSpinning = false;
  private tiles = [];

  tilePool: NodePool = new NodePool();
  reelNumber = -1;
  newTile: Node;
  maskedHeight;
  tile;
  tileAdjustor = 0;
  noOfTiles = 7;
  resultShow = false;
  dirModifier = 1;
  resultSprites = [];
  visiblereel: any[] = [];
  MachineDelegate: Machine = null;
  protected onLoad(): void {
    this.resultSprites = [...this.tileSprites];
    console.log("resulArray REfilled", this.resultSprites);
  }
  // Setting Delegate
  set SettingMachineDelegate(Machine) {
    this.MachineDelegate = Machine;
  }

  /**
   *
   * @param reelNum
   * @description this function is used to create reel using tiles
   */
  createReel(reelNum: number, tileSize): number {
    this.tile = instantiate(this.tilePrefab);
    this.tile.getComponent(UITransform).height = tileSize.Height;
    this.tile.getComponent(UITransform).width = tileSize.Width;
    this.reelNumber = reelNum;
    // this line of code hide 2 tile for every set of tile
    this.node.getComponent(UITransform).height = (this.noOfTiles - 2) * this.tile.getComponent(UITransform).height;

    for (let i = 0; i < this.noOfTiles; i++) {
      this.newTile = instantiate(this.tilePrefab);
      this.newTile.getComponent(UITransform).height = tileSize.Height;
      this.newTile.getComponent(UITransform).width = tileSize.Width;
      if (this.newTile) {
        this.newTile.getComponent(Tile).updateString((i + 1).toString());
        this.newTile.name = i.toString();
      }
      this.reelAnchor.addChild(this.newTile);
      this.reelAnchor.getComponent(Layout).updateLayout();
      this.maskedHeight = this.reelAnchor.getComponent(UITransform).height - this.node.getComponent(UITransform).height;
      this.tiles[i] = this.newTile;
    }

    return this.node.getComponent(UITransform).height;
  }

  resultArray = [1, 2, 3];
  tileCount = 0;
  /**
   *
   * @param element
   * @description this function is used to Reposition the tiles
   */
  changeCallback(element: Node = null): void {
    this.dirModifier = -1;
    let check = 0;
    if (this.noOfTiles > 5) {
      check = element.getComponent(UITransform).height;
    }
    let visibleTalesManager = this.noOfTiles % 5;
    if (this.noOfTiles < 5) {
      visibleTalesManager = -1;
    }

    if (element.position.y > this.maskedHeight + check) {
      let tileScript = element.getComponent(Tile);
      // console.log(this.resultSprites);

      let num = this.resultSprites[0];
      if (this.resultShow == true && this.resultSprites.length > 0) {
        num = this.resultSprites.pop(); //randomRangeInt(1, this.noOfTiles + 1
        this.visiblereel.push([element.getWorldPosition(), element]);
        if (this.visiblereel.length == this.noOfTiles - 2) {
          console.log("Print-->");
          gameData.getInstance().pushTileRef(this.visiblereel);
          this.visiblereel = [];
        }
        this.tileCount++;
        tileScript.setTile(num);
      }

      element.position = new Vec3(
        0,
        this.maskedHeight * this.dirModifier - element.getComponent(UITransform).height * visibleTalesManager * 0.5,
        0
      );
    }
  }

  /**
   *
   * @description used to check when to stop the spin of a particular Reel
   * @param element
   *  @param Index Tile Index - for Check Which Tile is Stopped
   */
  checkEndCallback(element: Node = null, index): void {
    if (this.stopSpinning) {
      this.doStop(element, index);
    } else {
      this.doSpinning(element, index);
    }
  }

  doSpinning(element: Node = null, index, times = 1): void {
    this.dirModifier = 1;
    const move = tween().by(this.spinSpeed, { position: new Vec3(0, this.maskedHeight * 0.5 * this.dirModifier, 0) });
    const doChange = tween().call(() => {
      this.changeCallback(element);
    });

    const repeat = tween(element).repeat(times, move.then(doChange));
    const checkEnd = tween().call(() => {
      //   console.log("Repeat");
      this.checkEndCallback(element, index);
    });
    repeat.then(checkEnd).start();
  }

  /**
   *
   * @param windUp
   * @description used to spin the tiles using tween
   */
  doSpin(windUp): void {
    //Tile ref Empty for EveryNewSpin
    gameData.getInstance().initTileRef = [];
    this.visiblereel = [];
    this.dirModifier = 1;
    this.reelAnchor.children.forEach((element, index) => {
      const delay = tween(element).delay(windUp);
      const start = tween(element).by(0.5, { position: new Vec3(0, this.maskedHeight * 0.5 * this.dirModifier, 0) });
      const doChange = tween().call(() => this.changeCallback(element));
      const callSpinning = tween(element).call(() => this.doSpinning(element, index, 5));
      delay.then(start).then(doChange).then(callSpinning).start();
    });
  }

  /**
   * @ Checks For Stop Reel
   */

  readyStop() {
    this.stopSpinning = true;
    this.resultShow = true;
  }

  /**
   * @des Stops Every Tile
   * @param element Tiles
   * @param Index Tile Index - for Check Which Tile is Stopped
   */

  doStop(element, index) {
    //  console.log("Do Stop");
    this.dirModifier = -1;
    const move = tween(element).by(0.05, { position: new Vec3(0, this.maskedHeight * 0.5, 0) });
    const lastMove = tween().by(0.05, { position: new Vec3(0, element.getComponent(UITransform).height, 0) });
    const doChange = tween().call(() => {
      this.changeCallback(element);
    });
    let end = tween()
      .by(
        0.25,
        {
          position: new Vec3(
            0,
            this.maskedHeight * 0.5 * this.dirModifier + element.getComponent(UITransform).height,
            0
          ),
        },
        { easing: "bounceOut" }
      )
      .call(() => {
        this.stopSpinning = false;
        this.resultShow = false;
        this.resultSprites = [...this.tileSprites];
        //Send Call to Make Spin Button Interactive When Reel Stop
        // Adding one to make tile index to tile count
        if (index + 1 == this.noOfTiles) {
          // Adding One to Make Reel index to Reel Count
          this.MachineDelegate.SpinAgainInteraction(this.reelNumber + 1);
        }
      });
    let result = tween(element).call(() => {
      this.resultShow = true;
    });
    // Didnt UnderStand Why this we are doing
    // here we used cases because of the result tile sprite change accordingly
    switch (this.noOfTiles) {
      case 4:
        move.then(doChange).then(move).then(doChange).then(end).start();
        break;
      case 5:
        move.then(doChange).then(move).then(doChange).then(lastMove).then(doChange).then(end).start();
        break;

      case 6:
        move
          .then(doChange)
          .then(move)
          .then(doChange)
          .then(lastMove)
          .then(doChange)
          .then(lastMove)
          .then(doChange)
          .then(end)
          .start();
        break;

      case 7:
        move
          .then(doChange)
          .then(move)
          .then(doChange)
          .then(lastMove)
          .then(doChange)
          .then(lastMove)
          .then(doChange)
          .then(lastMove)
          .then(doChange)
          .then(end)
          .start();
        break;

      default:
        break;
    }
  }
}
