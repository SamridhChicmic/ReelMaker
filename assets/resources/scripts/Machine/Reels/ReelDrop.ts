import { _decorator, animation, Component, director, instantiate, Label, Layers, Layout, log, Node, NodePool, Prefab, tween, UI, UITransform, Vec3 } from 'cc';
import { Tile } from '../Tile';

const { ccclass, property } = _decorator;

@ccclass('ReelDrop')
export class ReelDrop extends Component {
    @property({ type: Prefab })
    tilePrefab: Prefab = null;

    @property({ type: Node })
    public reelAnchor = null;

    @property({ type: Node })
    ReelMask = null;

    public spinSpeed = 0.05;
    public stopSpinning = false;
    private tiles = [];

    tilePool: NodePool = new NodePool();
    reelNumber = -1;
    newTile: Node;
    maskedHeight;
    tile;
    tileAdjustor = 0;
    noOfTiles = 4;


    //----------------------------------------------------------onLoad()--------------------------------------------------------------------


    protected onLoad(): void {

    }




    //----------------------------------------------------------createReel()--------------------------------------------------------------------

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
        this.node.getComponent(UITransform).height = ((this.noOfTiles - 2) * this.tile.getComponent(UITransform).height);

        for (let i = 0; i < this.noOfTiles; i++) {
            this.newTile = instantiate(this.tilePrefab);
            this.newTile.getComponent(UITransform).height = tileSize.Height;
            this.newTile.getComponent(UITransform).width = tileSize.Width;
            if (this.newTile) {
                this.newTile.getChildByName("tileNum").getComponent(Label).string = (i + 1).toString();
                this.newTile.name = i.toString();
            }
            this.reelAnchor.addChild(this.newTile);
            this.reelAnchor.getComponent(Layout).updateLayout();
            // this.reelAnchor.height = 1125;
            this.ReelMask.getComponent(UITransform).height = this.reelAnchor.getComponent(UITransform).height;
            this.maskedHeight = (this.reelAnchor.getComponent(UITransform).height - this.node.getComponent(UITransform).height);
            this.tiles[i] = this.newTile;
        }

        return this.ReelMask.getComponent(UITransform).height;

    }


    //----------------------------------------------------------changeCallback()--------------------------------------------------------------------

    resultArray = [7, 8, 9, 10, 11]

    /**
     * 
     * @param element 
     * @description this function is used to Reposition the tiles 
     */
    changeCallback(eelement: Node = null): void {
        const dirModifier = -1;
        let check = 0;
        if (this.noOfTiles > 5) {
            check = (eelement.getComponent(UITransform).height);
        }
        let visibleTalesManager = this.noOfTiles % 5;
        if (this.noOfTiles < 5) {
            visibleTalesManager = -1;
        }
        // let element = this.reelAnchor.children[0];
        if (eelement.position.y * dirModifier > this.maskedHeight - eelement.getComponent(UITransform).height * 2) {
            console.log(eelement.getChildByName("tileNum").getComponent(Label).string)
            let tileScript = eelement.getComponent(Tile);
            let num = 0;
            if (this.resultArray.length > 0) {


                // console.log("TILE SPRITE :- ", this.resultArray.pop());
                num = this.resultArray.pop();//randomRangeInt(1, this.noOfTiles + 1


            }
            // tileScript.setTile(num);
            eelement.position = new Vec3(0, (this.ReelMask.getComponent(UITransform).height), 0); //+ ((eelement.getComponent(UITransform).height * (visibleTalesManager)) * 0.5)
        }
    }



    /**
     * 
     * @param windUp 
     * @description used to spin the tiles using tween
     */
    doSpin(windUp): void {
        for (let i = this.reelAnchor.children.length - 1; i >= 0; i--) {
            let element = this.reelAnchor.children[i];
            let direction = -1;
            const delay = tween(element).delay(((this.reelAnchor.children.length + 1) - i) * 0.2);
            const doChange = tween().call(() => { this.changeCallback(element); this.scheduleOnce(() => { this.spinAgain() }, 1.5) });
            const start = tween(element).by(0.3, { position: new Vec3(0, (this.maskedHeight * 2) * direction, 0) }); //time = 0.8
            delay.then(start).then(doChange).start(); //then(doChange)
        }

    }


    //----------------------------------------------------------spinAgain()--------------------------------------------------------------------



    spinAgain() {
        console.log("spinAgain called");

        for (let i = this.reelAnchor.children.length - 1; i >= 0; i--) {
            let element = this.reelAnchor.children[i];
            let direction = -1;
            const delay = tween(element).delay(((this.reelAnchor.children.length + 1) - i) * 0.2);
            let position = (((this.node.getComponent(UITransform).height) + element.getComponent(UITransform).height) * 0.5 * direction) + element.getComponent(UITransform).height * (((this.reelAnchor.children.length - 1) - i));
            const start = tween(element).to(0.2, { position: new Vec3(0, position, 0) }); //time = 0.8 (this.maskedHeight + (element.getComponent(UITransform).height * (this.reelAnchor.children.length - 1))) * direction
            delay.then(start).start(); //then(doChange)
        }
    }


    //----------------------------------------------------------stopDrop()--------------------------------------------------------------------

    // stopDrop(element, i) {
    //     let dirModifier = -1;
    //     if (element.position.y > this.maskedHeight) { // - (element.getComponent(UITransform).height * (i + 1)
    //         tween(element).stop()
    //     }
    // }


    //----------------------------------------------------------readyStop()--------------------------------------------------------------------



    readyStop() {
        this.stopSpinning = true;
    }
    count = 0;
    doStop(element) {
        let dirModifier = -1;
        this.count++;
        tween(element).by(
            10,
            { position: new Vec3(0, (((this.maskedHeight * 0.5) * dirModifier) * element.getComponent(UITransform).height * this.count), 0) },
            { easing: "bounceOut" }
        ).start();
    }
}

