import { _decorator, Animation, animation, AnimationClip, Component, instantiate, Label, log, Node, NodePool, Prefab, resources, Sprite, SpriteFrame, UITransform } from 'cc';
import { gameData } from '../Common/gameData';
const { ccclass, property } = _decorator;

@ccclass('Animation_1')
export class Animation_1 extends Component {
    drumsArray = [];

    @property(Prefab)
    popUpPrefab: Prefab = null;
    popUpNode = null;
    poolSize = 15;
    popupPool = new NodePool();
    rowAnimationNode = null;
    tileRef = null;
    tileparent = null;
    protected onLoad(): void {
        resources.loadDir("sprites/Drumscompressed", SpriteFrame, (err, dir) => {
            if (!err) {
                this.drumsArray = dir;

                console.log(this.drumsArray)
            }
        })
    }


    start() {
        for (let index = 0; index < this.poolSize; index++) {
            let PopupNode = instantiate(this.popUpPrefab);
            this.popupPool.put(PopupNode);
        }

    }



    setNodePosition(pos) {
        this.node.setPosition(pos);
    }

    // 0 : Row Animation  1: Column Animation  2 : None
    animationType = 0;

    playAnimation(x, y, nodeIndex) {

        this.tileRef = gameData.getInstance().getTileRefArr();
        this.tileparent = this.tileRef[nodeIndex][1].parent;
        if (this.animationType == 1) {
            console.log("tileRef----", this.tileRef);
            let tileNum = this.tileparent.children.length;
            for (let i = 4; i <= this.tileRef.length; i += tileNum - 2) {
                this.tileRef[i][1].getComponent(Sprite).spriteFrame = null;
            }
        } else if (this.animationType == 0) {
            this.tileparent.children.forEach((e) => {
                e.active = false;
            })
        }



        console.log("this.popupPool.size", this.popupPool.size())
        if (this.popupPool.size()) {
            let node = this.popupPool.get();
            node.setPosition(x, y);
            this.node.addChild(node);
            let clip = AnimationClip.createWithSpriteFrames(this.drumsArray, this.drumsArray.length);
            let animation = node.getComponent(Animation);
            let anim = animation.createState(clip, "Drum");
            anim.speed = 1;
            anim.repeatCount = 100;
            anim.play()
        }
    }

    stopAnimation() {
        if (this.tileparent != null) {
            this.tileparent.children.forEach((e) => {
                e.active = true;
            })
        }
        while (this.node.children.length > 0) {
            let node = this.node.children.pop();
            setTimeout(() => {
                this.popupPool.put(instantiate(this.popUpPrefab))
                node.destroy();
            })
        }
    }


    update(deltaTime: number) {

    }
}

