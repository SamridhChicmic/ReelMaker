import { _decorator, animation, Component, director, instantiate, Label, Layers, Layout, log, Node, NodePool, Prefab, tween, UI, UITransform, Vec3 } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('reels')
export class reels extends Component {

    @property({ type: Prefab })
    tilePrefab: Prefab = null;

    @property({ type: Node })
    public reelAnchor = null;

    public spinSpeed = 0.05;
    public stopSpinning = false;
    private tiles = [];

    tilePool: NodePool = new NodePool();
    reelNumber = -1;
    newTile: Node;
    maskedHeight;
    tile;
    tileAdjustor = 0;
    noOfTiles = 5;
    protected onLoad(): void {
        this.tile = instantiate(this.tilePrefab);
    }


    /**
     * 
     * @param reelNum 
     * @description this function is used to create reel using tiles 
     */
    createReel(reelNum: number): void {
        // let this.newTile: Node;
        this.reelNumber = reelNum;

        this.node.getComponent(UITransform).height = ((this.noOfTiles - 2) * this.tile.getComponent(UITransform).height);

        for (let i = 0; i < this.noOfTiles; i++) {
            this.newTile = instantiate(this.tilePrefab);
            if (this.newTile) {
                this.newTile.getChildByName("tileNum").getComponent(Label).string = (i + 1).toString();
                this.newTile.name = i.toString();
            }
            this.reelAnchor.addChild(this.newTile);
            this.reelAnchor.getComponent(Layout).updateLayout();
            // this.reelAnchor.height = 1125;
            this.maskedHeight = (this.reelAnchor.getComponent(UITransform).height - this.node.getComponent(UITransform).height);



            this.tiles[i] = this.newTile;

        }

    }

    /**
     * 
     * @param element 
     * @description this function is used to Reposition the tiles 
     */
    changeCallback(element: Node = null): void {
        const dirModifier = -1;
        // console.log("element.position.y", element.position.y);
        // console.log("this.maskedHeight", this.maskedHeight);

        console.log("Masked Height", this.maskedHeight);
        let check = 0;
        if (this.noOfTiles > 5) {
            check = (element.getComponent(UITransform).height);
        }

        if (element.position.y > this.maskedHeight + check) {
            console.log("--", element.getChildByName('tileNum').getComponent(Label).string);
            element.position = new Vec3(0, (this.maskedHeight * dirModifier) - ((element.getComponent(UITransform).height * (this.noOfTiles % 5)) * 0.5), 0);
        }
    }

    /**
     * 
     * @param element 
     * @description used to check when to stop the spin of a particular Reel
     */
    checkEndCallback(element: Node = null): void {
        console.log(this.stopSpinning);

        if (this.stopSpinning) {
            this.doStop(element);
        } else {
            this.doSpinning(element);
        }
    }


    doSpinning(element: Node = null, times = 1): void {
        const dirModifier = -1;
        const move = tween().by(this.spinSpeed, { position: new Vec3(0, (this.maskedHeight * 0.5), 0) });
        const doChange = tween().call(() => {
            this.changeCallback(element)

        });
        const repeat = tween(element).repeat(times, move.then(doChange));
        const checkEnd = tween().call(() => this.checkEndCallback(element));
        repeat.then(checkEnd).start();


    }

    /**
     * 
     * @param windUp 
     * @description used to spin the tiles using tween
     */
    doSpin(windUp): void {
        this.reelAnchor.children.forEach((element) => {
            //    console.log("For Each Element", element);

            const dirModifier = -1;
            const delay = tween(element).delay(windUp);
            const start = tween(element).by(
                0.5,
                { position: new Vec3(0, (this.maskedHeight * 0.5), 0) },
                { easing: "backIn" }
            );
            const doChange = tween().call(() => this.changeCallback(element));
            const callSpinning = tween(element).call(() => this.doSpinning(element, 50));
            delay.then(start).then(doChange).then(callSpinning).start();
        });
    }

    readyStop() { this.stopSpinning = true; }

    doStop(element) {
        let dirModifier = -1;

        tween(element).by(
            0.25,
            { position: new Vec3(0, ((this.maskedHeight * 0.5) * dirModifier), 0) },
            { easing: "bounceOut" }
        ).start();

        console.log("stopped");


    }

    update(deltaTime: number) {

    }
}

