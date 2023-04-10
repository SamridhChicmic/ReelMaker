import { _decorator, AnimationClip, Component, Label, Node, Sprite, SpriteFrame, tween, Vec2, Vec3 } from 'cc';


const { ccclass, property } = _decorator;

@ccclass('Tile')
export class Tile extends Component {

    start() {

    }


    setTile(Num: SpriteFrame) {

        this.node.getComponent(Sprite).spriteFrame = Num;
        // this.node.getChildByName("tileNum").getComponent(Label).string = Num.toString();
    }

    update(deltaTime: number) {


    }
}

