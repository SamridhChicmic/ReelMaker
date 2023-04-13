import { _decorator, AnimationClip, Component, Label, Node, Sprite, SpriteFrame, tween, Vec2, Vec3 } from 'cc';
import { GameData } from '../Common/GameData';
import { Animation_1 } from '../Animation/Animation_1';


const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {


    @property(Node)
    tileSymbol: Node = null;
    start() {

    }


    setTile(Num: SpriteFrame) {

        this.node.getComponent(Sprite).spriteFrame = Num;
        // this.node.getChildByName("tileNum").getComponent(Label).string = Num.toString();
    }

    playAnimation = (reelNode) => {
        // this.tileSymbol.getComponent(Animation).play("AC");
        // this.tileSymbol.active = false;
        //  console.log("CHECK @ ", numInViewArr);
        console.log("Tile node from tile script", this.node.getWorldPosition());
        console.log("Name of tile from tile script", this.node.name);
        GameData.Instance.PopOutAnimNodeRef.getComponent(Animation_1).playAnimation(
            this.node, reelNode
        );
    }


    update(deltaTime: number) {


    }
}

